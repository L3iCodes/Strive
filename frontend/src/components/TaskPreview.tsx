import { Calendar, ChevronDown, Ellipsis, Flag, ListTodo, Notebook, UserPlusIcon, Users, X } from "lucide-react";
import { useBoardStore } from "../store/useTaskStore"
import { useEffect, useState } from "react";
import NewSubtaskForm from "./forms/NewSubtaskForm";

const TaskPreview = () => {
    const { isPreviewOpen, closePreview, task } = useBoardStore();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditMode(false);
    }, [isPreviewOpen])

    return (
        <div className={`h-full pt-[75px] p-5 md:p-5 w-full max-w-md flex flex-col gap-3 fixed top-0 bg-base-300 border-1 border-base-content/20 shadow-xl/55 z-10 
                        transition-all duration-150 ease-in-out
                        ${isPreviewOpen ? 'right-0' : '-right-150'}`}
        >
            <div className="w-full h-fit p-2 flex border-b-1 items-center border-base-content/20">
                <h1 className="font-black">Task Details</h1>
                <div className="ml-auto flex gap-2">
                    <Ellipsis className="transition-all hover:scale-103 cursor-pointer" />
                    <X onClick={closePreview} className=" transition-all hover:scale-103 cursor-pointer" />
                </div>
            </div>
            
            <form className="flex flex-col text-xs gap-3">
                <div className="flex flex-col gap-5 p-2">
                    <input 
                        type="text" 
                        placeholder="Board Name"
                        value={task?.task_name} 
                        readOnly={!editMode}
                        className={`input w-full p-2 rounded-xs text-[15px] font-medium ${editMode ? 'cursor-text border-1 border-base-content/20 bg-base-100' : 'border-0 cursor-pointer bg-base-300 !px-0'}`}
                        onChange={(e) => e.stopPropagation()}
                        onClick={() => setEditMode(true)}
                    />
                    
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="flex items-center gap-1 text-base-content/80"><Flag size={13}/>Priority</label>
                            
                            <details onClick={() => setEditMode(true)} className="dropdown">
                                <summary className={`w-full flex items-start p-2 border-1 border-base-content/20 cursor-pointer bg-base-100 ${editMode ? 'bg-base-100' : 'cursor-pointer bg-base-300'}`}>
                                    <p>{task?.priority}</p>
                                    <ChevronDown className="ml-auto" size={16} />
                                </summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-1 shadow-sm w-full text-xs border-1 border-base-content/10">
                                    <li className="font-medium border-b-1 border-base-content/10"><a className={`${task?.priority === 'none' && 'hidden'} flex flex-col gap-1 items-start`}>none</a></li>
                                    <li className="font-medium border-b-1 border-base-content/10"><a className={`${task?.priority === 'low' && 'hidden'} flex flex-col gap-1 items-start`}>low</a></li>
                                    <li className="font-medium border-b-1 border-base-content/10"><a className={`${task?.priority === 'medium' && 'hidden'} flex flex-col gap-1 items-start`}>medium</a></li>
                                    <li className="font-medium border-b-1 border-base-content/10"><a className={`${task?.priority === 'high' && 'hidden'} flex flex-col gap-1 items-start`}>high</a></li>
                                </ul>
                            </details>
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="flex items-center gap-1 text-base-content/80"><Calendar size={13}/>Due Date</label>
                            <input 
                                type="date" 
                                placeholder="Enter due date" 
                                readOnly={!editMode}
                                value={task?.due_date ? new Date(task.due_date).toISOString().split("T")[0] : ""}  
                                className={`input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 text-xs ${editMode ? 'cursor-text bg-base-100' : 'cursor-pointer bg-base-300'}`}
                                onChange={(e) => console.log(e.currentTarget.value)}
                                onClick={() => setEditMode(true)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1 text-base-content/80"><Notebook size={13}/>Description</label>
                        <textarea 
                            placeholder="Board Description"
                            value={task?.description} 
                            readOnly={!editMode}
                            className={`input w-full h-[70px] px-2 py-2 rounded-xs border-1 border-base-content/20 resize-none text-xs ${editMode ? 'cursor-text bg-base-100' : 'cursor-pointer bg-base-300'}`}
                            onChange={(e) => e.stopPropagation()}
                            onClick={() => setEditMode(true)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 border-b-1 border-base-content/20">
                        <label className="flex items-center gap-1 text-base-content/80"><Users size={13}/>Assignees</label>
                        <div className="h-20 p-2 flex flex-col items-center">
                            {task && task?.assignees.length < 1 && (<h1 className="mx-auto my-auto text-sm text-base-content/50">No one assigned to this task</h1>)}
            
                        </div>

                        <button type='button' className="p-2 w-full flex gap-2 items-center justify-center border-1 border-base-content/10 text-xs rounded-md hover:bg-base-200 active:bg-base-100 cursor-pointer mb-3"
                        >
                            <UserPlusIcon size={13}/> Assign to Member
                        </button>
                    </div>
                </div>
                <div className="p-2 flex flex-col gap-2 border-b-1 border-base-content/20">
                        <label className="flex items-center gap-1 text-base-content/80 text-sm"><ListTodo size={13}/>Subtasks</label>
                        {/* TODO: ADD SUBTASK LIST */}
                        <NewSubtaskForm subTasks={task?.checklist}/>
                    </div>
            </form> 
        </div>
    )
}

export default TaskPreview
