import { Calendar, ChevronDown, Flag, Notebook } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useTaskStore } from '../../store/useTaskStore';

interface taskInfoForm {
    name?: string;
    description?: string;
    priority?: 'none' | 'low' | 'medium' | 'high'
    dueDate?: Date | undefined;
};

const TaskInfoForm = ({ name, description, priority, dueDate }: taskInfoForm) => {
    const { isPreviewOpen, closePreview, task } = useTaskStore();
    const [editMode, setEditMode] = useState(false);
    
    useEffect(() => {
        setEditMode(false);
    }, [isPreviewOpen])

    return (
        <form className="flex flex-col text-xs gap-3">
            <div className="flex flex-col gap-5">
                <input 
                    type="text" 
                    placeholder="Board Name"
                    value={name} 
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
                                <p>{priority}</p>
                                <ChevronDown className="ml-auto" size={16} />
                            </summary>
                            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-1 shadow-sm w-full text-xs border-1 border-base-content/10">
                                <li className="font-medium border-b-1 border-base-content/10"><a className={`${priority === 'none' && 'hidden'} flex flex-col gap-1 items-start`}>none</a></li>
                                <li className="font-medium border-b-1 border-base-content/10"><a className={`${priority === 'low' && 'hidden'} flex flex-col gap-1 items-start`}>low</a></li>
                                <li className="font-medium border-b-1 border-base-content/10"><a className={`${priority === 'medium' && 'hidden'} flex flex-col gap-1 items-start`}>medium</a></li>
                                <li className="font-medium border-b-1 border-base-content/10"><a className={`${priority === 'high' && 'hidden'} flex flex-col gap-1 items-start`}>high</a></li>
                            </ul>
                        </details>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className="flex items-center gap-1 text-base-content/80"><Calendar size={13}/>Due Date</label>
                        <input 
                            type="date" 
                            placeholder="Enter due date" 
                            readOnly={!editMode}
                            value={dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""}  
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
                        value={description} 
                        readOnly={!editMode}
                        className={`input w-full h-[70px] px-2 py-2 rounded-xs border-1 border-base-content/20 resize-none text-xs ${editMode ? 'cursor-text bg-base-100' : 'cursor-pointer bg-base-300'}`}
                        onChange={(e) => e.stopPropagation()}
                        onClick={() => setEditMode(true)}
                    />
                </div>
            </div>
        </form>
    )
}

export default TaskInfoForm
