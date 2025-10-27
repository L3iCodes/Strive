import { axiosInstance } from "../lib/axios";
import type { InviteUserVariables } from "../types";

export const getInvites = async () => {
    try{
        const res = await axiosInstance.get(`collab/getInvite`);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const inviteUser = async (inviteData: InviteUserVariables) => {

    try{
        const res = await axiosInstance.post(`collab/invite`, inviteData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const inviteResponse = async (inviteData: any) => {

    try{
        const res = await axiosInstance.post(`collab/response`, inviteData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const updateRole = async (userRoleData: any) => {

    try{
        const res = await axiosInstance.post(`collab/updateRole`, userRoleData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const requestAccess = async (requestData: any) => {

    try{
        const res = await axiosInstance.post(`collab/request`, requestData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};

export const requestResponse = async (requestData: any) => {

    try{
        const res = await axiosInstance.post(`collab/requestResponse`, requestData);
        return res.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'An unexpected error occurred');
    };
};