import { axiosInstance } from "../lib/axios";

interface changePasswordVariables{
    oldPassword: string;
    newPassword: string;
}

export const changePassword = async (password: changePasswordVariables) => {
    try{
        const res = await axiosInstance.post("/user/changePassword", password);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateProfile = async (profileData: any) => {
    try{
        const res = await axiosInstance.post("/user/updateProfile", profileData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};