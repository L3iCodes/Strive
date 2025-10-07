import { axiosInstance } from "../lib/axios";

export const createSection = async (sectionData: any) => {
    try{
        const res = await axiosInstance.post("/section/create", sectionData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const deleteSection = async (sectionId: string) => {
    try{
        const res = await axiosInstance.delete(`/section/delete/${sectionId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateSection = async (sectionData: any) => {
    
    try{
        const res = await axiosInstance.post(`/section/update`, sectionData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};