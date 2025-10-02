import { axiosInstance } from "../lib/axios";

export const createTask = async (newTask: any) => {

    try{
        const res = await axiosInstance.post(`/task/create`, newTask);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const deleteTask = async (taskData: any) => {
    console.log(taskData)
    try{
        const res = await axiosInstance.post(`/task/delete`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};