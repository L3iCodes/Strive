import { Ellipsis, ListTodo, UserPlusIcon, Users, X } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore"
import NewSubtaskForm from "./forms/NewSubtaskForm";
import TaskInfoForm from "./forms/TaskInfoForm";
import Subtask from "./Subtask";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../apis/task.api";
import type { Task } from "../types";
import { useAuthStore } from "../store/useAuthStore";

const TaskPreview = () => {
    const { isPreviewOpen, closePreview, taskId } = useTaskStore();
    const { userRole } = useAuthStore();
    
    const canEdit = userRole && ['owner', 'editor'].includes(userRole);


    
    const { data: task } = useQuery<Task>({
        queryKey: ['task', taskId],
        queryFn: () => getTask(taskId as string),
        enabled: !!taskId && isPreviewOpen,
    });
    
    return (
        <div className={`h-full pt-[75px] p-5 md:p-5 w-full max-w-md flex flex-col gap-3 fixed top-0 bg-base-100 border-1 border-base-content/20 shadow-xl/55 z-10 
                        transition-all duration-400 ease-in-out
                        ${isPreviewOpen ? 'right-0' : '-right-150'}`}
        >
            <div className="w-full h-fit p-2 flex border-b-1 items-center border-base-content/20">
                <h1 className="font-black">Task Details</h1>
                <div className="ml-auto flex gap-2">
                    <Ellipsis className="transition-all hover:scale-103 cursor-pointer" />
                    <X onClick={closePreview} className=" transition-all hover:scale-103 cursor-pointer" />
                </div>
            </div>
            
            <div className="p-2 flex flex-col text-xs gap-5">
                < TaskInfoForm sectionId={task?.section as string} taskId={task?._id} task_name={task?.task_name} description={task?.description} priority={task?.priority} dueDate={task?.due_date}/>

                {/* Assignee function */}
                <div className="flex flex-col gap-2 border-b-1 border-base-content/20">
                    <label className="flex items-center gap-1 text-base-content/80"><Users size={13}/>Assignees</label>
                    <div className="h-20 p-2 flex flex-col items-center">
                        {task && task?.assignees.length < 1 && (<h1 className="mx-auto my-auto text-sm text-base-content/50">No one assigned to this task</h1>)}
        
                    </div>

                    {canEdit && (
                        <button type='button' className="p-2 w-full flex gap-2 items-center justify-center border-1 border-base-content/10 text-xs rounded-md hover:bg-base-200 active:bg-base-100 cursor-pointer mb-5"
                        >
                            <UserPlusIcon size={13}/> Assign to Member
                        </button>
                    )}
                </div>
                
                {/* Subtask list */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1 text-base-content/80 text-sm"><ListTodo size={13}/>Subtasks</label>
                    
                    <div className="flex flex-col gap-1">
                        {task?.checklist.map((subtask) => (
                            <Subtask key={subtask._id} taskId={task._id} sectionId={task.section} subtask={subtask} />
                        ))}
                    </div>
                    
                    {canEdit && (
                        <NewSubtaskForm taskId={task?._id as string} sectionId={task?.section as string}/>
                    )}
                </div>
            </div> 
        </div>
    );
};

export default TaskPreview