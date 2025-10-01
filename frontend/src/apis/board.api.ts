import { axiosInstance } from "../lib/axios";
import { type BoardProps } from "../store/useKanbanStore";

export const getBoards = async () => {
    try{
        const res = await axiosInstance.get("/board/boards");
        return res.data.result;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const getKanbanBoard = async (boardId: String): Promise<BoardProps> => {
    try{
        const res = await axiosInstance.get<{ board: BoardProps }>(`/board/${boardId}`);
        return res.data.board;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const createBoard = async (boardData: any) => {
    try{
        const res = await axiosInstance.post("/board/create", boardData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};