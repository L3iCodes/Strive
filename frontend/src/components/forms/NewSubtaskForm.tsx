import { Plus } from "lucide-react"
import type { CheckList } from "../../types"
import { useTask } from "../../hooks/useTask"
import { useParams } from "react-router-dom"
import { useState } from "react";

interface newSubtaskForm {
    sectionId: string;
    taskId: string;
}

const NewSubtaskForm = ({sectionId, taskId}: newSubtaskForm) => {
    const param = useParams();
    const { addSubTaskMutation } = useTask(param.id as string);
    const [subtaskData, setSubtaskData] = useState<CheckList>({sub_task: '', done: false})
    
    const handleSubtaskCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addSubTaskMutation.mutate(
            {sectionId, taskId, subtaskData}, 
            {onSuccess: () => {
                setSubtaskData({...subtaskData, sub_task:''})
            }
        });  
    };

    return (
        <form onSubmit={handleSubtaskCreation}>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    placeholder="Add a subtask..." 
                    required={true}
                    value={subtaskData.sub_task}
                    disabled={addSubTaskMutation.isPending}
                    className="input w-full h-fit p-2 rounded-xs border-1 border-base-content/20 bg-base-300/0 text-xs"
                    onChange={(e) => setSubtaskData({...subtaskData, sub_task: e.currentTarget.value})}
                />
                <button 
                    type="submit"
                    disabled={addSubTaskMutation.isPending}
                    className="btn h-8 w-8 flex items-center justify-center p-1 bg-base-100 border-1 border-base-content/20 rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-300 cursor-pointer">
                        <Plus size={15}/>
                    </button>
            </div>
        </form>
    )
}

export default NewSubtaskForm
