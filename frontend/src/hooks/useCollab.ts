import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteResponse, inviteUser, requestAccess, requestResponse, updateRole } from "../apis/collab.api";
import { useSocket } from "./useSocket";

export const useCollab = (boardId: string) => {
    const queryClient = useQueryClient();
    const { socket } = useSocket();

    const inviteUserMutation = useMutation({
        mutationFn: inviteUser,
        onSuccess: async () => {
            await queryClient.refetchQueries({queryKey: ['kanban', boardId]});
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const inviteResponseMutation = useMutation({
        mutationFn: inviteResponse,
        onSuccess: async (data) => {
            console.log('NEW DATA', data.board)
            console.log('BOARDID:', boardId)

            queryClient.invalidateQueries({queryKey: ['invites']});
            queryClient.invalidateQueries({queryKey: ['boards']});
            
            socket?.emit('UPDATE_BOARD', { board:data.board, boardId: data.board._id });
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: updateRole,
        onSuccess: async () => {
            await queryClient.refetchQueries({queryKey: ['kanban', boardId]});
            queryClient.invalidateQueries({queryKey: ['invites']});
            queryClient.invalidateQueries({queryKey: ['boards']});
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const requestAccessMutation = useMutation({
        mutationFn: requestAccess,
        onSuccess: async (_data) => {
            // await queryClient.refetchQueries({queryKey: ['kanban', boardId]});
            // socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const requestResponseMutation = useMutation({
        mutationFn: requestResponse,
        onSuccess: async (_data) => {
            await queryClient.refetchQueries({queryKey: ['kanban', boardId]});
            queryClient.invalidateQueries({queryKey: ['invites']});
            queryClient.invalidateQueries({queryKey: ['boards']});
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        onError: (error) => {
            console.log(error)
        }
    });

    return({ inviteUserMutation, inviteResponseMutation, updateRoleMutation, requestAccessMutation, requestResponseMutation });
};