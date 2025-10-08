import type { Section } from "./section.types";
import type { User } from "../store/useAuthStore";
import type { Collaborators } from "./collab.types";

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

interface Activities{
    board: string;
    user: User;
    action: string;
    createdAt: Date | string;
};