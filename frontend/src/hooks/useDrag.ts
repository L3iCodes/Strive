import { MouseSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type Active, type UniqueIdentifier, type DragEndEvent } from '@dnd-kit/core'
import { act, useState } from 'react';
import type { Task, Section } from '../types';
import { useBoard } from './useBoard';
import { useParams } from 'react-router-dom';
import { arrayMove } from '@dnd-kit/sortable';
import { useDragAPI } from './useDragAPI';

export const useDrag = () => {
    const param = useParams();
    const [activeDragId, setActiveDragId] = useState<string>();
    const [activeDragItem, setActiveDragItem] = useState<Task | Section | null>(null)     
    const { kanban: board } = useBoard(param.id);
    const { sectionReorderMutation } = useDragAPI(param.id as string);
    
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

        if (idString.startsWith('section-')) {
            const sectionId = idString.replace('section-', '');
          
            // Find the section
            const section = board?.sections
                ?.find(section => section._id === sectionId);
            
            setActiveDragItem(section ?? null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveDragId(undefined); 
        setActiveDragItem(null);

        const { active, over } = event;
        const activeId = active.id.toString();
        const overId = over?.id.toString();

        if(!over) return;

        // Section Reordering
        if(activeId.startsWith('section-') && overId?.startsWith('section-')){
            const oldIndex = board?.sections.findIndex(s=>`section-${s._id}` === activeId) as number;
            const newIndex = board?.sections.findIndex(s=>`section-${s._id}` === overId) as number;

            if(board && oldIndex !== -1 && newIndex !== -1){
                // Arrange the section (remove section from old index, then put it at new index)
                const newSectionOrder = arrayMove(board?.sections, oldIndex, newIndex);
                sectionReorderMutation.mutate({ boardId:param.id as string, newSectionOrder });
            }
        };
    };

    return(
        { 
            activeDragId,
            activeDragItem,
            sensors, 
            handleDragStart, 
            handleDragEnd,
        }
    );
};