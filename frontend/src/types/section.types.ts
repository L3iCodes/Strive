import type { Task } from "./task.types";

export interface Section{
    _id: string;
    name: string;
    board: string;
    tasks: Task[];
};