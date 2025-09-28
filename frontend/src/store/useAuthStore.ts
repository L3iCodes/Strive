import { create } from "zustand";

export interface User {
    _id?: string;
    username?: string;
    password?: string;
    email: string;
    avatar?: string | null;
};

interface AuthProps {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (authState: boolean) => void;
};

export const useAuthStore = create<AuthProps>((set) => ({
    user: null,
    isAuthenticated: false,
    
    setUser: (user) => {
        set({user})
    },

    setIsAuthenticated: (authState) => {
        set({isAuthenticated: authState})
    },
}));