import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardProps } from "../types";
import { createSection, deleteSection, updateSection } from "../apis/section.api";
import { useSocket } from "./useSocket";

export const useSection = (boardId: string) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const createSectionMutation = useMutation({
        mutationFn: createSection,
        onSuccess: (data, _variables) => {
            // Update cache with new section
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old: BoardProps | undefined) => {
                if (!old) return old;
                
                const updatedBoard = {
                    ...old, 
                    sections: [...old.sections, data]
                }

                return updatedBoard;
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        },
        
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
        }
    });

    const deleteSectionMutation = useMutation({
        mutationFn: (sectionId: string) => deleteSection(sectionId),
        onMutate: (sectionId) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId])

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if (!old) return old;

                const updatedSection = old.sections.filter(section => section._id !== sectionId);

                return{
                    ...old,
                    sections: updatedSection
                };
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });

            return { previousBoard };
            
        },
        onSuccess: (_data, _variables) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
            // socket?.emit('UPDATE_BOARD', { boardId: boardId });
        },
        onError: (error, _sectionId, context) => {
            console.log(error);

            // Revert to previous board data
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            if(context?.previousBoard){
                queryClient.setQueryData(['boards'], context.previousBoard);
            };
        }
    });

    const updateSectionMutation = useMutation({
        mutationFn: updateSection,
        onMutate: (variables) => {
            const previousBoard = queryClient.getQueryData<BoardProps>(['kanban', boardId])

            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old): any => {
                if(!old) return old;

                const updatedSection = old.sections.map(section => 
                    section._id === variables.sectionId
                        ? {...section, name: variables.sectionName}
                        : section
                )

                return{
                    ...old,
                    sections: updatedSection
                };
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });

            return { previousBoard };
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
            // socket?.emit('UPDATE_BOARD', { boardId: boardId });
            
        },
        onError: (error, _sectionId, context) => {
            console.log(error);

            // Revert to previous board data
            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            if(context?.previousBoard){
                queryClient.setQueryData(['boards'], context.previousBoard);
            };
        }
    })

    return { createSectionMutation, deleteSectionMutation, updateSectionMutation };
};