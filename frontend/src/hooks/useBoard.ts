import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import { createBoard, deleteBoard, getBoards } from "../apis/board.api";
import { useEffect } from "react";
import { useBoardStore } from "../store/useBoardStore";
import type { BoardSummary } from "../store/useBoardStore";

export const useBoard = (boardId: string) => {
    const queryClient = useQueryClient();
    const { setBoards, setFilterBoard } = useBoardStore();

    const { data, isLoading:isBoardLoading } = useQuery<BoardSummary[]>({
        queryKey: ["boards"],
        queryFn: getBoards,
    });

    useEffect(() => {
        if (data) {
            setBoards(data);
        }
    }, [data, setBoards]);

    const createBoardMutation = useMutation({
        mutationFn: createBoard,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["boards"]})
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const deleteBoardMutation = useMutation({
        mutationFn: deleteBoard,
        onMutate: (variables) => {
            const previousBoards = queryClient.getQueryData<BoardSummary[]>(['boards']);

            queryClient.setQueryData<BoardSummary[]>(['boards'], (old) => {
                if(!old) return old;
                const newBoards = old.filter(board => board._id != variables.boardId);
                setBoards(newBoards);
            });

            return { previousBoards };
        },  
        onSuccess: (data) => {
            
        },
        onError: (error, context) => {
            console.log(error);
            
            if(context?.previousBoards){
                queryClient.setQueryData(['boards'], context.previousBoards);
                setBoards(context.previousBoards);
            };
        
        }
    });

    return({createBoardMutation, isBoardLoading, deleteBoardMutation})
};