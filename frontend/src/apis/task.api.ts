import { axiosInstance } from "../lib/axios";

export const getTask = async (taskId: string) => {
    try{
        const res = await axiosInstance.get(`task/${taskId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const createTask = async (newTask: any) => {

    try{
        const res = await axiosInstance.post(`/task/create`, newTask);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const deleteTask = async (taskId: string) => {
    
    try{
        const res = await axiosInstance.delete(`/task/delete/${taskId}`);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateTask = async (taskData: any) => {

    try{
        const res = await axiosInstance.post(`/task/update`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const addSubTask = async (taskData: any) => {
    try{
        const res = await axiosInstance.post(`task/subtask/add`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};