import { axiosInstance } from "../lib/axios";
import type { InviteUserVariables } from "../types";

export const getInvites = async () => {
    console.log('In get Invite')
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