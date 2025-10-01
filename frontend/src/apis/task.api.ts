import { axiosInstance } from "../lib/axios";

export const createTask = async (newTask: any) => {

    try{

        const res = await axiosInstance.post(`/task/create/`, newTask);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};