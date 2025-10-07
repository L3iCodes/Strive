import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types";
import { TaskMenu } from "./Menu";
import { useState } from "react";

interface TaskProps{
    task: Task;
};

const priorityMap: any = {
  low: { classname: "bg-success/30 text-success" },
  medium: { classname: "bg-warning/30 text-warning" },
  high: { classname: "bg-error/30 text-warning" },
};

const TaskComponent = ({task}: TaskProps) => {
    const { showPreview } = useTaskStore();
    const [openTaskMenu, setOpenTaskMenu] = useState(false);

    return (
        <div 
            onMouseEnter={() => setOpenTaskMenu(true)}
            onMouseLeave={() => setOpenTaskMenu(false)}
            onMouseOver={() => () => setOpenTaskMenu(true)}
            onClick={() => showPreview(task._id as string)}
            className={`relative w-full h-[80px] shrink-0 flex flex-col gap-1 bg-base-100 rounded-xs border-1 border-base-content/10 p-1 text-xs cursor-pointer transition-all hover:scale-103 active:hover:scale-100 hover:border-2 hover:z-10`}
            >
            
            {openTaskMenu && (<TaskMenu sectionId={task.section} taskData={task} />)}
            
            <p className={`${priorityMap[task.priority]?.classname} flex justify-center h-5 px-1 w-15 text-center rounded-tl-xs border-1 border-base-content/10 absolute top-0 left-0`}>
                {task.priority === 'none' ? "" : task.priority}
            </p>
            <h1 className="text-[14px] mt-5 font-medium">{task.task_name}</h1>
        </div>
    );
};

export default TaskComponent;