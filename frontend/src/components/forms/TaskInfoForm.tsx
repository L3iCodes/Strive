import { Calendar, ChevronDown, Flag, Notebook } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import { useTaskStore } from '../../store/useTaskStore';
import { useTask } from '../../hooks/useTask';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export interface TaskInfoFormProps {
    _id?: string;
    sectionId?: string;
    taskId?: string;
    task_name?: string;
    description?: string;
    priority?: 'none' | 'low' | 'medium' | 'high'
    dueDate?: Date | null | undefined;
};

const TaskInfoForm = ({ sectionId, taskId, task_name, description, priority, dueDate }: TaskInfoFormProps) => {
    const param = useParams();
    const { isPreviewOpen, closePreview } = useTaskStore();
    const { updateTaskMutation } = useTask({boardId:param.id});
    const [editMode, setEditMode] = useState(false);
    const [taskData, setTaskData] = useState({task_name, taskId, description, priority, dueDate})
    const dropDownRef = useRef<HTMLDetailsElement>(null);
    const priorityChoice = ['none', 'low', 'medium', 'high'] as const;
    const { userRole } = useAuthStore();

    const canEdit = userRole && ['owner', 'editor'].includes(userRole);

    const handleEditMode = () => {
        if (canEdit) setEditMode(true);
    };

    useEffect(() => {
        setTaskData({ task_name, taskId, description, priority, dueDate });
    }, [task_name, description, priority, dueDate]);

    useEffect(() => {
        setEditMode(false);
    }, [isPreviewOpen])

    const handleTaskUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateTaskMutation.mutate(
            {sectionId, taskData},
            {onSuccess: () => {
                //Add notification
            }}
        );

        dropDownRef.current?.removeAttribute("open")
        setEditMode(false);
    };
    
    return (
        <form onSubmit={handleTaskUpdate} className="flex flex-col text-xs gap-3">
            <div className="flex flex-col gap-5">
                <input 
                    type="text" 
                    placeholder="Board Name"
                    value={taskData.task_name} 
                    readOnly={!editMode}
                    className={`input w-full p-2 rounded-xs text-[15px] font-medium ${editMode ? 'cursor-text border-1 border-base-content/20 bg-base-300' : 'border-0 cursor-pointer bg-base-100 !px-0'}`}
                    onChange={(e) => setTaskData({...taskData, task_name:e.currentTarget.value})}
                    onClick={() => {handleEditMode(), dropDownRef.current?.removeAttribute("open")}}
                />
                
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="flex items-center gap-1 text-base-content/80"><Flag size={13}/>Priority</label>
                        
                        <details ref={dropDownRef} onClick={handleEditMode} className="dropdown">
                            <summary className={`w-full flex items-start p-2 border-1 border-base-content/20 cursor-pointer bg-base-100 ${editMode ? 'bg-base-300' : 'cursor-pointer bg-base-100'}`}>
                                <p>{taskData.priority}</p>
                                <ChevronDown className="ml-auto" size={16} />
                            </summary>
                            {editMode && (
                                <ul className={`menu dropdown-content bg-base-100 rounded-box z-1 p-1 shadow-sm w-full text-xs border-1 border-base-content/10`}>
                                    {priorityChoice.map(choice => (
                                        <li key={choice}
                                            onClick={() => {setTaskData({...taskData, priority: choice}), dropDownRef.current?.removeAttribute("open");}} 
                                            className="font-medium border-b-1 border-base-content/10"
                                            >
                                                <a className={`${taskData.priority === 'high' && 'hidden'} flex flex-col gap-1 items-start`}>
                                                    {choice}
                                                </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                        </details>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="flex items-center gap-1 text-base-content/80"><Calendar size={13}/>Due Date</label>
                        <input 
                            type="date" 
                            placeholder="Enter due date" 
                            readOnly={!editMode}
                            value={taskData.dueDate ? new Date(taskData.dueDate).toISOString().split("T")[0] : ""}  
                            className={`input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 text-xs ${editMode ? 'cursor-text bg-base-300' : 'cursor-pointer bg-base-100'}`}
                            onChange={(e) => setTaskData({...taskData, dueDate:e.currentTarget.valueAsDate})}
                            onClick={() => {handleEditMode(), dropDownRef.current?.removeAttribute("open")}}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 text-base-content/80"><Notebook size={13}/>Description</label>
                    <textarea 
                        placeholder="Board Description"
                        value={taskData.description} 
                        readOnly={!editMode}
                        className={`input w-full h-[70px] px-2 py-2 rounded-xs border-1 border-base-content/20 resize-none text-xs ${editMode ? 'cursor-text bg-base-300' : 'cursor-pointer bg-base-100'}`}
                        onChange={(e) => setTaskData({...taskData, description:e.currentTarget.value})}
                        onClick={() => {handleEditMode(), dropDownRef.current?.removeAttribute("open")}}
                    />
                </div>

                {editMode && (
                    <div className='flex ml-auto w-fit gap-1'>
                        <button type='button' onClick={() => {handleEditMode(),  setTaskData({ task_name, taskId, description, priority, dueDate })}} className='ml-auto p-1 px-2 text-sm border-1 border-base-content/20 rounded-xs hover:bg-base-200 hover:text-base-content active:bg-base-100 cursor-pointer'>Cancel</button>
                        
                        <button type='submit' className='ml-auto p-1 px-2 bg-base-100 text-sm border-1 border-base-content/20 rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-100 cursor-pointer'>Save</button>
                    </div>
                )}
            </div>
        </form>
    );
};

export default TaskInfoForm
