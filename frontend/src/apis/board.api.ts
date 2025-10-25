import { axiosInstance } from "../lib/axios";
import type { BoardProps, BoardSummary } from "../types";

export const getBoards = async (): Promise<BoardSummary[]> => {
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

export const createBoard = async (boardData: any): Promise<BoardProps> => {
    try{
        const res = await axiosInstance.post("/board/create", boardData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const deleteBoard = async (boardId: string) => {
    console.log('deleting in api', boardId)
    try{
        const res = await axiosInstance.delete(`/board/delete/${boardId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateBoard = async (boardData: any) => {
    try{
        const res = await axiosInstance.post(`/board/update`, boardData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateLastOpened = async (boardData: any): Promise<BoardProps> => {
    try{
        const res = await axiosInstance.post("/board/updateLastOpened", boardData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};