import type { Section } from "./section.types";
import type { User } from "../store/useAuthStore";

export interface BoardSummary {
    _id: string; 
    name: string;
    desc: string;
    owner: string;
    collaborators: {
        _id: string;
        avatar: string;
    }[];
    totalTasks: number;
    doneTasks: number;
    lastOpened: string; 
};

export interface BoardProps{
    _id: string;
    name: string;
    desc: string;
    owner: User;
    collaborators: Collaborators[];
    sections: Section[];
    activities: Activities[];
    lastOpened?: Date | string;
    favorite?: boolean;
    pinned?: boolean;
};

export interface Collaborators{
    user: User;
    role: 'viewer' | 'editor';
    status: 'pending' | 'accepted';
};

interface Activities{
    board: string;
    user: User;
    action: string;
    createdAt: Date | string;
};