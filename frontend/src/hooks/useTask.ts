import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask } from "../apis/task.api";
import { type BoardProps } from "../store/useKanbanStore";

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
        mutationFn: deleteTask,
        onSuccess(data, _variables) {
            // Update the cache directly removing the task
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if (!old) return old;
        
                const updateSection = old.sections.map((section) => 
                    section._id === data.section
                        ?   {
                                ...section,
                                tasks: section.tasks.filter((task) => task._id != data._id)
                            }
                        : section
                    )

                return {
                    ...old,
                    sections: updateSection
                };
            });
        },
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
        }
    })

    return { createTaskMutation, deleteTaskMutation };
};