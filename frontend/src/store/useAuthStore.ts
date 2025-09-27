import { create } from "zustand";
import { sampleUserData } from "./sampleData";

export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string | null;
};

interface AuthProps {
    user: User;
    isAuthenticated: boolean;
};

export const useAuthStore = create<AuthProps>((set) => ({
    user: sampleUserData.user,
    isAuthenticated: true,
}));