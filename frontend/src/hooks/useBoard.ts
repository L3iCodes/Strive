import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import { createBoard, getBoards } from "../apis/board.api";
import { useEffect } from "react";
import { useBoardStore } from "../store/useBoardStore";
import type { BoardSummary } from "../store/useBoardStore";

export const useBoard = () => {
    const queryClient = useQueryClient();
    const { setBoards } = useBoardStore();

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

    return({createBoardMutation, isBoardLoading})
};