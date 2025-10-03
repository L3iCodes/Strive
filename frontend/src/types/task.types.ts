import type { User } from "../store/useAuthStore";

export interface CheckList{
    sub_task: string;
    done: boolean;
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