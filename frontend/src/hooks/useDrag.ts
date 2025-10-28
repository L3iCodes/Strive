import { MouseSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { useState } from 'react';
import type { Task, Section } from '../types';
import { useBoard } from './useBoard';
import { useParams } from 'react-router-dom';
import { arrayMove } from '@dnd-kit/sortable';
import { useDragAPI } from './useDragAPI';
import { useAuthStore } from '../store/useAuthStore';

export const useDrag = () => {
    const param = useParams();
    const [activeDragId, setActiveDragId] = useState<string>();
    const [activeDragItem, setActiveDragItem] = useState<Task | Section | null>(null)     
    const { kanban: board } = useBoard(param.id);
    const { userRole } = useAuthStore()
    const { sectionReorderMutation, dragTaskMutation } = useDragAPI(param.id as string);
    
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
        if(userRole === 'viewer') return;

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
        if(userRole === 'viewer') return;
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

        // Task reordering
        if(activeId.startsWith('task') && overId?.startsWith('task') || overId?.startsWith('empty-placeholder-')){
            let sourceSectionIndex = -1;
            let targetSectionIndex = -1;

            // Find the source section
            board?.sections.forEach((section, index) => {
                if(section.tasks.some(task => `task-${task._id}` === activeId)) sourceSectionIndex = index;
            });

            // Find the target section
            if (overId.startsWith('empty-placeholder-')) {
                const targetSectionId = overId.replace('empty-placeholder-', '');
                targetSectionIndex = board?.sections.findIndex(section => section._id.toString() === targetSectionId) ?? -1;
            }else{
                 board?.sections.forEach((section, index) => {
                    if(section.tasks.some(task => `task-${task._id}` === overId)) targetSectionIndex = index;
                });
            }

            if (sourceSectionIndex === -1 || targetSectionIndex === -1) return;

            // Get the sections info
            const sourceSection = [...board?.sections[sourceSectionIndex].tasks ?? []];
            const targetSection = [...board?.sections[targetSectionIndex].tasks ?? []];

            // Find index of active and over task
            const activeTask = sourceSection.findIndex(task => `task-${task._id}` === activeId);
            const overTask = (sourceSection === targetSection
                ? sourceSection
                : targetSection
            ).findIndex(task => `task-${task._id}` === overId);

            // Remove from the task from the source
            const [movedTask] = sourceSection.splice(activeTask, 1);
            
            // Reorder within the same section
            if(sourceSectionIndex === targetSectionIndex){
                sourceSection.splice(overTask, 0, movedTask)

                dragTaskMutation.mutate({
                    taskId: movedTask._id,  
                    sourceSectionId: board?.sections[sourceSectionIndex]._id as string,
                    targetSectionId: board?.sections[targetSectionIndex]._id as string, 
                    taskOrder: sourceSection
                });
            }else{
                if (overId.startsWith('empty-placeholder')) {
                    targetSection.unshift(movedTask);
                }else{
                    let overTask = targetSection.findIndex(task => `task-${task._id}` === overId);
                    targetSection.splice(overTask, 0, movedTask);
                }

                dragTaskMutation.mutate({
                    taskId: movedTask._id, 
                    sourceSectionId: board?.sections[sourceSectionIndex]._id as string, 
                    targetSectionId: board?.sections[targetSectionIndex]._id as string, 
                    taskOrder: targetSection
                });
            } 

            
        }
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