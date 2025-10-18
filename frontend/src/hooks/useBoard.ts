import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import { createBoard, deleteBoard, getBoards, getKanbanBoard, updateLastOpened } from "../apis/board.api";
import { useState } from "react";
import type { BoardSummary, BoardProps } from "../types";
import { useAuthStore } from "../store/useAuthStore";


export const useBoard = (boardId?: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const [filteredBoards, setFilterBoard] = useState<BoardSummary[]>([]);

    const { data:boardList, isLoading:isBoardLoading } = useQuery<BoardSummary[]>({
        queryKey: ["boards"],
        queryFn: getBoards,
    });

    const { data:kanban , isLoading:isKanbanLoading } = useQuery<BoardProps>({
        queryKey: ['kanban', boardId],   // include the id in the key
        queryFn: () => getKanbanBoard(boardId as string),
        enabled: !!boardId,
        
        // CRITICAL: Prevent automatic refetches during drag operations
        refetchOnWindowFocus: false,  // Don't refetch when window regains focus
        refetchOnMount: false,         // Don't refetch when component remounts
        refetchOnReconnect: false,     // Don't refetch on network reconnect
        staleTime: 5 * 60 * 1000,      // Consider data fresh for 5 minutes
        
        // Optional: Keep data in cache longer
        gcTime: 10 * 60 * 1000,   
    });

    const createBoardMutation = useMutation({
        mutationFn: createBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["boards"]})
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (boardId: string) => deleteBoard(boardId),
        onMutate: async (boardId) => {
            console.log(boardId)
            // Cancel queries
            await queryClient.cancelQueries({ queryKey: ['boards'] });

            // Store previous data
            const previousBoards = queryClient.getQueryData<BoardSummary[]>(['boards']);
            
            // Cache new data
            queryClient.setQueryData<BoardSummary[]>(['boards'], (old) => {
                if(!old) return old;
                const newBoards = old.filter(board => board._id !== boardId);
                return (newBoards)
            });

            return { previousBoards };
        },  
        onSuccess: (data) => {
            
        },
        onError: (error, _boardId, context) => {
            console.log(error);
            
            // Revert to previous board list
            if(context?.previousBoards){
                queryClient.setQueryData(['boards'], context.previousBoards);
            };
        }
    });

    const updateLastOpenedMutation = useMutation({
        mutationFn: updateLastOpened,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['boards']})
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const filter = (tab: any) => {
            let filtered: BoardSummary[] = [];
            if(!boardList) return;

            switch(tab) {
                case 'recent':
                    filtered = [...boardList].sort((a,b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
                    break;
                case 'personal':
                    filtered = boardList?.filter(board => board.owner === user?._id);
                    break;
                case 'shared':
                    filtered = boardList?.filter(board => board.owner !== user?._id);
                    break;
                default:
                    filtered = boardList;
            }
            setFilterBoard(filtered);
        };

    return(
        {
            createBoardMutation, 
            boardList, 
            isBoardLoading, 
            deleteBoardMutation, 
            filter, 
            filteredBoards,

            kanban,
            isKanbanLoading,
            
            updateLastOpenedMutation
        });
};