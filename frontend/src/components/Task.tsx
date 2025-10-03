import { Trash } from "lucide-react";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import type { Task } from "../types";

interface TaskProps{
    task: Task;
};

const priorityMap: any = {
  low: { classname: "bg-success text-success-content border-success-content/10" },
  medium: { classname: "bg-warning text-warning-content border-warning-content/10" },
  high: { classname: "bg-error text-error-content border-error-content/10" },
};

const TaskComponent = ({task}: TaskProps) => {
    const param = useParams();
    const { deleteTaskMutation } = useTask(param.id as string);

    return (
        <div className="w-full h-[80px] shrink-0 flex flex-col gap-1 bg-base-100 rounded-xs border-1 border-base-content/10 p-1 text-xs relative">
            <p className={`${priorityMap[task.priority]?.classname} px-1 w-10 text-center border-1 rounded-xs`}>
                {task.priority}
            </p>
            <h1 className="text-[14px] font-medium">{task.task_name}</h1>
            <Trash onClick={() => deleteTaskMutation.mutate({boardId:param.id, taskId:task._id})} />
        </div>
    );
};

export default TaskComponent;