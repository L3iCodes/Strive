import type { UniqueIdentifier } from "@dnd-kit/core";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types";
import { TaskMenu } from "./Menu";
import { useState } from "react";
import { useSort } from "../hooks/useSort";

interface TaskProps{
    task: Task;
    id: UniqueIdentifier
};

const priorityMap: any = {
  low: { classname: "bg-success/30 text-success" },
  medium: { classname: "bg-warning/30 text-warning" },
  high: { classname: "bg-error/30 text-error" },
};

const TaskComponent = ({ task, id }: TaskProps) => {
    const { showPreview } = useTaskStore();
    const { setNodeRef, attributes, listeners, dragStyle } = useSort(id);
    const [openTaskMenu, setOpenTaskMenu] = useState(false);
    const { userRole } = useAuthStore(); 

    return (
        <div 
            ref={setNodeRef} {...listeners} {...attributes}
            style={dragStyle}
            onMouseEnter={() => setOpenTaskMenu(true)}
            onMouseLeave={() => setOpenTaskMenu(false)}
            onMouseOver={() => () => setOpenTaskMenu(true)}
            onClick={() => showPreview(task._id as string)}
            className={`relative w-full h-[80px] shrink-0 flex flex-col gap-1 bg-base-200 rounded-xs border-1 border-base-content/10 p-1 text-xs cursor-pointer transition-all hover:scale-103 active:hover:scale-100 hover:border-2 hover:z-5`}
            >
            
            {(userRole !== 'viewer' && openTaskMenu) && (<TaskMenu taskData={task} />)}
            
            <p className={`${priorityMap[task.priority]?.classname} flex justify-center h-5 px-1 w-15 text-center rounded-tl-xs border-1 border-base-content/10 absolute top-0 left-0`}>
                {task.priority === 'none' ? "" : task.priority}
            </p>
            <h1 className="text-[14px] mt-5 font-medium">{task.task_name}</h1>

            <div className="h-5 mt-auto flex relative"> 
                {task.assignees.map((assignee, index) => (
                    <img
                        key={assignee._id}
                        src={assignee.avatar || ''}
                        className={`w-5 h-5 absolute rounded-full border-1 border-base-300 top-1/2 -translate-y-1/2`}
                        style={{ left: `${index * 10}px` }}
                    />
                ))}

            </div>
        </div>
    );
};

export default TaskComponent;