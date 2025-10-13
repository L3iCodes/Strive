import { axiosInstance } from "../lib/axios";

export const getTask = async (taskId: string) => {
    console.log('IN GETTASK API', taskId)
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

export const moveTask = async (taskData: any) => {
    
    try{
        const res = await axiosInstance.post(`task/task/move`, taskData);
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

export const deleteSubtask = async (taskData: any) => {
    try{
        const res = await axiosInstance.post(`task/subtask/delete`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateSubtask = async (taskData: any) => {
    
    try{
        const res = await axiosInstance.post(`task/subtask/update`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const assignTask = async (taskData: any) => {
    
    try{
        const res = await axiosInstance.post(`task/assignTask`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const removeAssignee = async (taskData: any) => {
    
    try{
        const res = await axiosInstance.post(`task/removeAssignee`, taskData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};
