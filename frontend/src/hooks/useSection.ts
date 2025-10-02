import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type BoardProps } from "../store/useKanbanStore";
import { createSection, deleteSection } from "../apis/section.api";

export const useSection = (boardId: string) => {
    const queryClient = useQueryClient();

    const createSectionMutation = useMutation({
        mutationFn: createSection,
        onSuccess: (data, _variables) => {
            // Update cache with new section
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old: BoardProps | undefined) => {
                if (!old) return old;
                
                return { 
                    ...old, 
                    sections: [...old.sections, data] // Append new section at the end
                };
            });
        },
        
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
        }
    });

    const deleteSectionMutation = useMutation({
        mutationFn: deleteSection,
        onSuccess: (data, _variables) => {
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old) => {
                if (!old) return old;

                const updatedSection = old.sections.filter(section => section._id !== data._id);

                return{
                    ...old,
                    sections: updatedSection
                };
            });
        },
        onError: (error) => {
            console.log(error);
            // Refetch if there's an error
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]});
        }
    })

    return { createSectionMutation, deleteSectionMutation };
};