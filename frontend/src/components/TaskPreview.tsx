import { Ellipsis, ListTodo, UserPlusIcon, Users, X } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore"
import NewSubtaskForm from "./forms/NewSubtaskForm";
import TaskInfoForm from "./forms/TaskInfoForm";
import Subtask from "./Subtask";

import { useAuthStore } from "../store/useAuthStore";
import CollabSearch from "./CollabSearch";
import { useEffect, useState } from "react";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import { CollaboratorAssignedCard } from "./CollboratorCard";


const TaskPreview = () => {
    const param = useParams();
    const { isPreviewOpen, closePreview, taskId } = useTaskStore();
    const { task } = useTask({ boardId:param.id, taskId:taskId as string });
    const { userRole } = useAuthStore();
    const [ isAssigneeOpen, setIsAssigneeOpen ] = useState(false);
    
    useEffect(() => {
        // Closes assignee search
        setIsAssigneeOpen(false)
        
    },[taskId, task])

    const canEdit = userRole && ['owner', 'editor'].includes(userRole);

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
                < TaskInfoForm 
                    key={task?._id}
                    sectionId={task?.section as string} 
                    taskId={task?._id} task_name={task?.task_name} 
                    description={task?.description} 
                    priority={task?.priority} 
                    dueDate={task?.due_date}
                />

                {/* Assignee function */}
                <div className="flex flex-col gap-2 border-b-1 border-base-content/20">
                    <label className="flex items-center gap-1 text-base-content/80"><Users size={13}/>Assignees</label>
                    <div className="max-h-20 flex flex-col gap-1 items-center">
                        {task && task?.assignees.length < 1 && (<h1 className="mx-auto my-auto text-sm text-base-content/50 mb-4">No one is assigned to this task</h1>)}
                      
                        {/* Assigned user list */}
                        {task?.assignees.map(collaborator => (
                            <CollaboratorAssignedCard key={collaborator._id} taskId={task._id as string} collaborator={collaborator}/>
                        ))}
                    </div>
                    
                    {canEdit && (
                        <div className="w-full relative">
                            <button 
                                onClick={() => setIsAssigneeOpen(s => !s)}
                                type='button' 
                                className="p-2 w-full flex gap-2 items-center justify-center border-1 border-base-content/10 text-xs rounded-md hover:bg-base-200 active:bg-base-100 cursor-pointer mb-5"
                            >
                                <UserPlusIcon size={13}/> Assign to Member
                            </button>

                            {isAssigneeOpen && (
                                <CollabSearch taskId={task?._id as string} assignees={task?.assignees}/>
                            )}
                        </div>
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