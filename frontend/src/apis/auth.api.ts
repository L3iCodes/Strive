import { axiosInstance } from "../lib/axios";
import type { User } from "../store/useAuthStore";

export const login = async (credentials:User) => {
    try{
        const res = await axiosInstance.post("/auth/login", credentials);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const verify = async () => {
    try{
        const res = await axiosInstance.get("/auth/verify");
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const logout = async () => {
    try{
        const res = await axiosInstance.get("/auth/logout");
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};