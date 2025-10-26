import { create } from "zustand";
import type { Collaborators } from "../types";

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
    isLoading: boolean;
    userRole: 'owner' | 'viewer' | 'editor' | null;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (authState: boolean) => void;
    setIsLoading: (loadState: boolean) => void;
    setUserRole: (owner: User, collaborators:Collaborators[]) => void;
};

export const useAuthStore = create<AuthProps>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading:true,
    userRole: null,
    
    setUser: (user) => {
        set({user})
    },

    setIsAuthenticated: (authState) => {
        set({isAuthenticated: authState})
    },

    setIsLoading: (loadState) => {
        set({isLoading: loadState})
    },

    setUserRole: (owner, collaborators) => {
        const user = get().user;
  
        if (!user?._id) return;
        
        // Check if user is owner
        if (user._id === owner?._id) {
            set({ userRole: 'owner' });
            return;
        };
        
        // Check if user is a collaborator
        const collab = collaborators.find(c => c.user._id === user._id);
        if (collab) {
            set({ userRole: collab.role });
        };
    }
}));