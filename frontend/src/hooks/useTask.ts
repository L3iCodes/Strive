import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask } from "../apis/task.api";
import type { BoardProps, TaskDeletion } from "../types";

export const useTask = (boardId: string) => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: (data, variables) => {
            // Update the cache directly with the new task
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if (!old) return old;
                
                const updatedSections = old.sections.map(section => {
                    if (section._id === variables.sectionId) {
                        return {
                            ...section,
                            tasks: variables.position === 'top' 
                                ? [data.task, ...section.tasks]
                                : [...section.tasks, data.task]
                        };
                    }
                    return section;
                });
                
                return { ...old, sections: updatedSections };
            });
        },
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: ({taskId}: TaskDeletion) => deleteTask(taskId),
        onMutate: ({sectionId, taskId}) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if(!old) return old;

                const updateSection = old.sections.map((section) => 
                    section._id === sectionId
                        ?   {
                                ...section,
                                tasks: section.tasks.filter((task) => task._id != taskId)
                            }
                        : section
                    )
                    
                return {
                    ...old,
                    sections: updateSection
                }
            });

            return { previousBoard };
        },
        onSuccess(data) {
            
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['boards'], context.previousBoard);
            };
        }
    })

    return { createTaskMutation, deleteTaskMutation };
};