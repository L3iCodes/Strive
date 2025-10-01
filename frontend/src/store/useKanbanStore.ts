import { type User } from "./useAuthStore";

export interface Collaborators{
    user: User;
    role: 'viewer' | 'editor';
    status: 'pending' | 'accepted';
};

interface CheckList{
    sub_task: string;
    done: boolean;
}

interface Activities{
    board: string;
    user: User;
    action: string;
    createdAt: Date | string;
}

export interface Task{
    _id: string;
    task_name: string;
    description: string;
    section: string;
    board:string;
    due_date: Date;
    priority: 'low' | 'medium' | 'high';
    checklist: CheckList[];
    assignees: User[];
    done:boolean;
};

export interface Section{
    _id: string;
    name: string;
    board: string;
    tasks?: Task[];
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
}