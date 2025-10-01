import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../apis/task.api";

export const useTask = () => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["kanban"]})
        },onError: (error) => {
            console.log(error)
        }
    })

    return({createTaskMutation})
};