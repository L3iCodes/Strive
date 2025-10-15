import { MouseSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type Active, type UniqueIdentifier } from '@dnd-kit/core'
import { useState } from 'react';
import type { Task } from '../types';
import { useBoard } from './useBoard';
import { useParams } from 'react-router-dom';

export const useDrag = () => {
    const param = useParams();
    const [activeDragId, setActiveDragId] = useState<string>();
    const [activeDragItem, setActiveDragItem] = useState<Task | null>(null)     
    const { kanban: board } = useBoard(param.id);
    
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, 
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, 
                tolerance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveDragId( active.id as string );
        
        // If dragging a task, find and store the task data
        const idString = String(active.id);
        if (idString.startsWith('task-')) {
            const taskId = idString.replace('task-', '');
          
            // Find the task in your sections
            const task = board?.sections
                ?.flatMap(section => section.tasks)
                ?.find(task => task._id === taskId);
            
            setActiveDragItem(task ?? null);
        }
    };

    return(
        { 
            activeDragId,
            activeDragItem,
            sensors, 
            handleDragStart, 
        }
    );
};