import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardProps, Section } from "../types";
import { reorderSection } from "../apis/dragDrop.api";

interface dragDropVariables {
    boardId: string;
    newSectionOrder: Section[];
};


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
        onSuccess: (updatedBoard) => {
            // queryClient.invalidateQueries({ queryKey: ['kanban', boardId] });
            queryClient.setQueryData(['kanban', boardId], updatedBoard);
        },
        onError: (error, _variables, context) => {
            console.log(error);
            
            // if(context && context.previousBoard){
            //     queryClient.setQueryData(['kanban', boardId], context.previousBoard)
            // }
        },
    }) 
    
    return ({ sectionReorderMutation })
};