import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardProps, Section, Task } from "../types";
import { dragTask, reorderSection } from "../apis/dragDrop.api";

interface dragDropVariables {
    boardId: string;
    newSectionOrder: Section[];
};

interface dragTaskVariables {
    taskId: string;
    sourceSectionId: string;
    targetSectionId: string; 
    taskOrder: Task[];
}


export const useDragAPI = (boardId: string) => {
    const queryClient = useQueryClient();

    const sectionReorderMutation = useMutation({
        mutationFn: ({boardId, newSectionOrder}: dragDropVariables) => reorderSection({boardId, newSectionOrder}),
        onMutate: async ({boardId, newSectionOrder}) => {
            await queryClient.cancelQueries({ queryKey: ['kanban', boardId] });

            const previousBoard = queryClient.getQueryData(['kanban', boardId])

            // Update board cache
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if(!old) return old;

                return {
                    ...old,
                    sections: newSectionOrder
                }
            });

            return ({ previousBoard });
        },
        onSuccess: (_updatedBoard) => {
            queryClient.invalidateQueries({ queryKey: ['kanban', boardId] });
            // queryClient.setQueryData(['kanban', boardId], updatedBoard);
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            if(context && context.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard)
            }
        },
    });

    const dragTaskMutation = useMutation({
        mutationFn: dragTask,
        onMutate: async ({taskId, sourceSectionId, targetSectionId, taskOrder}:dragTaskVariables) => {
            await queryClient.cancelQueries({ queryKey: ['kanban', boardId] });
            const previousBoard = queryClient.getQueryData(['kanban', boardId])

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if(!old) return old;

                const updatedSection = old.sections.map(section => {
                    let newSection = section
                    
                    // Remove task from the source section
                    if(section._id === sourceSectionId){
                        newSection = {
                            ...newSection,
                            tasks: newSection.tasks.filter(task => task._id !== taskId)
                        }
                    };

                    // Adjust task order from the target section
                    if(section._id === targetSectionId){
                        newSection = {
                            ...newSection,
                            tasks: taskOrder
                        }
                    };
                    return newSection
                })
                
                return{
                    ...old,
                    sections: updatedSection,
                };
            });

            return { previousBoard }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({ queryKey: ['kanban', boardId] });
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            if(context && context.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard)
            }
        },
    })
    
    
    
    return ({ sectionReorderMutation, dragTaskMutation })
};