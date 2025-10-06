import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubTask, createTask, deleteTask, updateTask } from "../apis/task.api";
import type { BoardProps, TaskDeletion, UpdateTaskVariables, AddSubTaskVariables } from "../types";

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
            console.log(previousBoard)
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
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
            };
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({taskData}: UpdateTaskVariables) => updateTask(taskData),
        onMutate: async ({ sectionId, taskData }) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
    
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old):any => {
                if(!old) return old;
                
                const updatedSections = old.sections.map((section) =>
                    section._id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task) =>
                            task._id === taskData.taskId
                            ? {
                                ...task,
                                task_name: taskData.task_name ?? task.task_name,
                                priority: taskData.priority ?? task.priority,
                                description: taskData.description ?? task.description,
                                due_date: taskData.dueDate ?? task.due_date,
                                }
                            : task
                        ),
                        }
                    : section
                );
                
                return {
                    ...old,
                    sections: updatedSections
                }
            });

            return { previousBoard };
        },
        onSuccess: (data) => {
            
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
            };
        }
    });

    const addSubTaskMutation = useMutation({
        mutationFn: ({subtaskData, taskId}: AddSubTaskVariables) => addSubTask({taskId, subtaskData}),
        onMutate: ({sectionId, taskId, subtaskData}) => {
            
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            
            const optimisticSubtask = {
                ...subtaskData,
                _id: `temp-${Date.now()}`, // Temporary ID
            };
            
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if(!old) return old;

                const updatedSections = old.sections.map((section) =>
                    section._id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task) =>
                            task._id === taskId
                            ?   {
                                    ...task,
                                    checklist: [...task.checklist, subtaskData]
                                }
                            : task
                        ),
                        }
                    : section
                );

                return {
                    ...old,
                    sections: updatedSections
                };
            });

            return{ previousBoard }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['task']})
            console.log(data)
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
            };
        }
    });

    return { createTaskMutation, deleteTaskMutation, updateTaskMutation, addSubTaskMutation };
};