import { axiosInstance } from "../lib/axios";

export const reorderSection = async (boardData: any) => {
    try{
        const res = await axiosInstance.post(`/dragDrop/reorderSection`, boardData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const dragTask = async (sectionData: any) => {
    try{
        const res = await axiosInstance.post(`/dragDrop/dragTask`, sectionData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};