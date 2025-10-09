import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteResponse, inviteUser } from "../apis/collab.api";

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

    const inviteResponseMutation = useMutation({
        mutationFn: inviteResponse,
        onMutate: (variables) => {
            console.log(variables)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
            queryClient.invalidateQueries({queryKey: ['invites']});
            queryClient.invalidateQueries({queryKey: ['boards']});
            console.log(data)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    return({ inviteUserMutation, inviteResponseMutation });
};