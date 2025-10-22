import { type UniqueIdentifier } from "@dnd-kit/core";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types";
import { TaskMenu } from "./Menu";
import { useState } from "react";
import { useSort } from "../hooks/useSort";
import { priorityMap } from "../utils/priority";
import { Calendar, SquareCheckBig } from "lucide-react";

interface TaskProps{
    task: Task;
    id: UniqueIdentifier
    className?: string;
};

const TaskComponent = ({ task, id, className }: TaskProps) => {
    const { showPreview } = useTaskStore();
    const { userRole } = useAuthStore(); 
    const { setNodeRef, attributes, listeners, dragStyle } = useSort(id);
    const [openTaskMenu, setOpenTaskMenu] = useState(false);
    

    return (
        <>
            <div 
                ref={setNodeRef} {...listeners} {...attributes}
                style={dragStyle}
                onMouseEnter={() => setOpenTaskMenu(true)}
                onMouseLeave={() => setOpenTaskMenu(false)}
                onMouseOver={() => () => setOpenTaskMenu(true)}
                onClick={() => showPreview(task._id as string)}
                className={`${className} relative w-full h-[90px] shrink-0 flex flex-col gap-1 bg-base-200 rounded-xs border-1 border-base-content/10 p-1 text-xs cursor-pointer transition-all hover:scale-103 active:hover:scale-100 hover:border-2 hover:z-5`}
                >
                
                {(userRole !== 'viewer' && openTaskMenu) && (<TaskMenu taskData={task} />)}
                
                <p className={`${priorityMap[task.priority]?.classname} flex justify-center h-5 px-1 w-15 text-center rounded-tl-xs border-1 border-base-content/10 absolute top-0 left-0`}>
                    {task.priority === 'none' ? "" : task.priority}
                </p>
                <p className="flex justify-center h-5 px-1 gap-1 text-center absolute top-1 right-0 text-base-content/50 text-[10px]">
                    <Calendar size={13}/>
                    {task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : ""}
                </p>

                <h1 className="text-[14px] mt-6 font-medium truncate">{task.task_name}</h1>

                <div className="h-[30%] mt-2 flex relative"> 
                    {task.assignees.map((assignee, index) => (
                        <img
                            key={assignee._id}
                            src={assignee.avatar || ''}
                            className={`w-5 h-5 absolute rounded-full border-1 border-primary top-1/2 -translate-y-1/2`}
                            style={{ left: `${index * 10}px` }}
                        />
                    ))}

                    {task.checklist.length > 0 && (
                        <p className="ml-auto flex gap-1 items-center text-[12px] text-base-content/50 mt-auto">
                            <SquareCheckBig size={13} />{task.checklist.filter(item => item.done).length}/{task.checklist.length}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskComponent;