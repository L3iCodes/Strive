import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteUser } from "../apis/collab.api";

export const useCollab = (boardId: string) => {
    const queryClient = useQueryClient();

    const inviteUserMutation = useMutation({
        mutationFn: inviteUser,
        onMutate: (variables) => {
            console.log(variables)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
            console.log(data)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    return({inviteUserMutation});
};