import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import { createBoard, deleteBoard, getBoards, getKanbanBoard, leaveBoard, updateBoard, updateLastOpened } from "../apis/board.api";
import { useState } from "react";
import type { BoardSummary, BoardProps } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { useSocket } from "./useSocket";

export const useBoard = (boardId?: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { socket } = useSocket();
    const [filteredBoards, setFilterBoard] = useState<BoardSummary[]>([]);

    const { data:boardList, isLoading:isBoardLoading } = useQuery<BoardSummary[]>({
        queryKey: ["boards"],
        queryFn: getBoards,
    });

    const { data:kanban , isLoading:isKanbanLoading } = useQuery<BoardProps>({
        queryKey: ['kanban', boardId], 
        queryFn: () => getKanbanBoard(boardId as string),
        enabled: !!boardId,
        
        // CRITICAL: Prevent automatic refetches during drag operations
        refetchOnWindowFocus: false,  // Don't refetch when window regains focus
        refetchOnMount: false,         // Don't refetch when component remounts
        refetchOnReconnect: false,     // Don't refetch on network reconnect
        staleTime: 0,      // Consider data fresh for 5 minutes
        
        // Optional: Keep data in cache longer
        gcTime: 10 * 60 * 1000,   
    });

    const createBoardMutation = useMutation({
        mutationFn: createBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["boards"]});

        },
        onError: (error) => {
            console.log(error);
        }
    });

    const updateBoardMutation = useMutation({
        mutationFn: updateBoard,
        onMutate: (variable) => {
            const previousBoard = queryClient.getQueryData(['kanban', boardId]);

            // Update cache with new section
            queryClient.setQueryData<BoardProps>(['kanban', boardId], (old: BoardProps | undefined) => {
                if (!old) return old;
                
                const updatedBoard = {
                    ...old, 
                    name: variable.title
                };

                return updatedBoard;
            });

            socket?.emit('UPDATE_BOARD', { board:queryClient.getQueryData(['kanban', boardId]), boardId: boardId });
            return({ previousBoard })
        },
        onSuccess: (_data) => {
            queryClient.invalidateQueries({queryKey: ['kanban', boardId]})
        },
        onError: (error, _variables, context) => {
            console.log(error)

            if(context?.previousBoard){
                queryClient.setQueryData(['kanban', boardId], context.previousBoard)
            };
        }
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (boardId: string) => deleteBoard(boardId),
        onMutate: async (boardId) => {
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
    
    const leaveBoardMutation = useMutation({
        mutationFn: leaveBoard,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({queryKey:['boards']})

            socket?.emit('UPDATE_BOARD', { board:data, boardId:data._id });
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
            
            updateLastOpenedMutation,
            updateBoardMutation,
            leaveBoardMutation
        });
};