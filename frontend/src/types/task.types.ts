import type { TaskInfoFormProps } from "../components/forms/TaskInfoForm";
import type { User } from "../store/useAuthStore";

export interface TaskDeletion{
    sectionId: string;
    taskId: string;
};

export interface CheckList{
    _id?: string;
    sub_task: string;
    done: boolean;
}

export interface UpdateTaskVariables {
    sectionId?: string;
    taskData: TaskInfoFormProps;
}

export interface AddSubTaskVariables {
    sectionId?: string;
    taskId: string;
    subtaskData: CheckList;
}

export interface Task{
    _id: string;
    task_name: string;
    description: string;
    section: string;
    board:string;
    due_date: Date | undefined;
    priority: 'none' | 'low' | 'medium' | 'high';
    checklist: CheckList[];
    assignees: User[];
    done:boolean;
};