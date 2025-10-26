import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSubTask, assignTask, createTask, deleteSubtask, deleteTask, getTask, moveTask, removeAssignee, updateSubtask, updateTask } from "../apis/task.api";
import type {  BoardProps,  TaskDeletion,  UpdateTaskVariables,  AddSubTaskVariables, Task, DeleteSubTaskVariables, UpdateSubTaskVariables, MoveTaskVariables, assignTaskVariables, Section } from "../types";
import { useTaskStore } from "../store/useTaskStore";
import { useSocket } from "./useSocket";

interface UseTaskVariable {
    boardId?: string,
    taskId?: string;
}

export const useTask = ({boardId, taskId}: UseTaskVariable) => {
    const queryClient = useQueryClient();
    const { isPreviewOpen } = useTaskStore();
    const { socket } = useSocket();

    const { data: task } = useQuery<Task>({
        queryKey: ['task', taskId],
        queryFn: () => getTask(taskId as string),
        enabled: !!taskId && isPreviewOpen,
    });

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

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
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

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            return { previousBoard };
        },
        onSuccess(_data) {
            
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
            };
        }
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({taskData}: UpdateTaskVariables) => updateTask(taskData),
        onMutate: async ({ sectionId, taskData }) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<BoardProps>(['task', taskId]);

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
                                done: taskData.done ?? task.done,
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

            queryClient.setQueryData<Task>(['task', taskId], (old):any => {
                if(!old) return old;

                return{
                    ...old,
                    task_name: taskData.task_name ?? old.task_name,
                    priority: taskData.priority ?? old.priority,
                    description: taskData.description ?? old.description,
                    due_date: taskData.dueDate ?? old.due_date,
                    done: taskData.done ?? old.done,
                }
            });

            // Emit to other user
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });
            
            return { previousBoard, previousTask };
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]});
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
            // Emit to other user
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });
        }
    });

    const moveTaskMutation = useMutation({
        mutationFn: ({receiverSectionId, taskData}: MoveTaskVariables) => moveTask({receiverSectionId, taskId:taskData._id}),
        onMutate: ({receiverSectionId, taskData}) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<BoardProps>(['task', taskId]);
            
            // Update task cache - section field
            const updatedTask = {...taskData, section: receiverSectionId};
            queryClient.setQueryData(['task', taskId], updatedTask);

            // Update board cache
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old):any => {
                if(!old) return old;

                const updatedSection = old.sections.map(section => {
                    // Remove task from original section
                    if(section._id === taskData.section){
                        return {
                            ...section,
                            tasks: section.tasks.filter(task => task._id !== taskData._id) 
                        };
                    };

                    if(section._id === receiverSectionId){
                        return {
                            ...section,
                            tasks: [...section.tasks, updatedTask]
                        };
                    };

                    return section;
                });

                return {
                    ...old,
                    sections: updatedSection
                }
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            return { previousBoard, previousTask };
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
  
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
            };
        }
    })

    const addSubTaskMutation = useMutation({
        mutationFn: ({subtaskData, taskId}: AddSubTaskVariables) => addSubTask({taskId, subtaskData}),
        onMutate: ({sectionId, taskId, subtaskData}) => {
            
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<BoardProps>(['task', taskId]);

            // Update board cache
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

             // Update task cache
            queryClient.setQueryData<Task>(['task', taskId], (old) => {
                if(!old) return old;

                return{
                    ...old,
                    checklist: [...old.checklist, subtaskData]
                }
            });

            // Emit to other user
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });

            return{ previousBoard, previousTask }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
        }
    });

    const deleteSubTaskMutation = useMutation({
        mutationFn: ({subtaskId, taskId}: DeleteSubTaskVariables) => deleteSubtask({taskId, subtaskId}),
        onMutate: ({subtaskId, taskId, sectionId}) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<BoardProps>(['task', taskId]);

            // Update board cache
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
                                    checklist: task.checklist.filter(subtask => subtask._id != subtaskId)
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

             // Update task cache
            queryClient.setQueryData<Task>(['task', taskId], (old) => {
                if(!old) return old;

                return{
                    ...old,
                    checklist: old.checklist.filter(subtask => subtask._id != subtaskId)
                }
            });

            // Emit to other user
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });

            return{ previousBoard, previousTask }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
        }
    });

    const updateSubtaskMutation = useMutation({
        mutationFn: ({taskId, subtaskData}: UpdateSubTaskVariables) => updateSubtask({taskId, subtaskData}),
        onMutate: ({taskId, subtaskData, sectionId}) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<BoardProps>(['task', taskId]);

            // Update board cache
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old:any) => {
                if(!old) return old;

                const updatedSections = old.sections.map((section:Section) =>
                    section._id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task:Task) =>
                            task._id === taskId
                            ?   {
                                    ...task,
                                    checklist: task.checklist.map(subtask => (
                                        subtask._id === subtaskData._id
                                        ?
                                            {
                                                ...subtask,
                                                sub_task: subtaskData.sub_task,
                                                done: subtaskData.done,
                                            }
                                        : subtask
                                    ))
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

            // Update task cache
            queryClient.setQueryData<Task>(['task', taskId], (old) => {
                if(!old) return old;
                
                const updatedChecklist = old.checklist.map(subtask => (
                    subtask._id === subtaskData._id
                    ?
                        {
                            ...subtask,
                            sub_task: subtaskData.sub_task,
                            done: subtaskData.done,
                        }
                    : subtask
                ));

                return{
                    ...old,
                    checklist: updatedChecklist,
                };
            });

            // Emit to other user
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });

            return{ previousBoard, previousTask }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // Revert board data if there is an error
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task: queryClient.getQueryData(['task', taskId]), taskId: taskId });

            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
        }
    })

    const assignTaskMutation = useMutation({
        mutationFn: assignTask,
        onMutate: ({ user, sectionId, taskId }: assignTaskVariables) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<Task>(['task', taskId]);

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old):any => {
                if(!old) return old;
                
                const updatedSections = old.sections.map((section) =>
                    section._id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task) =>
                            task._id === taskId
                            ? {
                                ...task,
                                assignees: [...task.assignees, user]
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
            
            // Update task cache
            queryClient.setQueryData<Task>(['task', taskId], (old: any) => {
                if(!old) return old;

                return {
                    ...old,
                    assignees: [...old.assignees, user]
                };
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task:queryClient.getQueryData(['task', taskId]), taskId: taskId });
           
            return { previousBoard, previousTask }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
        },
        onError: (error, _variables, context) => {
            console.log(error);

            // Revert board data if there is an error
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task:queryClient.getQueryData(['task', taskId]), taskId: taskId });
            if(context?.previousTask){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
        }
    });

    const removeAssigneekMutation = useMutation({
        mutationFn: removeAssignee,
         onMutate: ({ user, sectionId }: assignTaskVariables) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId]);
            const previousTask = queryClient.getQueryData<Task>(['task', taskId]);

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old):any => {
                if(!old) return old;
                
                const updatedSections = old.sections.map((section) =>
                    section._id === sectionId
                    ? {
                        ...section,
                        tasks: section.tasks.map((task) =>
                            task._id === taskId
                            ? {
                                ...task,
                                assignees: task.assignees.filter(assignee => assignee._id !== user?._id)
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

            // Update task cache
            queryClient.setQueryData<Task>(['task', taskId], (old) => {
                if(!old) return old;

                return {
                    ...old,
                    assignees: old.assignees.filter(assignee => assignee._id !== user?._id) // Remove assigned user
                };
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task:queryClient.getQueryData(['task', taskId]), taskId: taskId });
           
            return { previousBoard, previousTask }
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
        },
        onError: (error, _variables, context) => {
             console.log(error);

            // Revert board data if there is an error
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            socket?.emit('UPDATE_TASK', { task:queryClient.getQueryData(['task', taskId]), taskId: taskId });
            if(context?.previousTask){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard);
                queryClient.setQueryData(['task', taskId], context.previousTask);
            };
        }
    });

    return { 
            task,

            createTaskMutation, 
            deleteTaskMutation, 
            updateTaskMutation, 
            addSubTaskMutation, 
            
            deleteSubTaskMutation, 
            updateSubtaskMutation, 
            moveTaskMutation, 

            assignTaskMutation,
            removeAssigneekMutation,
        };
};