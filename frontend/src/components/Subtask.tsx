import { useParams } from 'react-router-dom';
import { useTask } from '../hooks/useTask';
import type { CheckList } from '../types'
import { Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface SubtaskProps {
    taskId: string;
    sectionId: string;
    subtask: CheckList;
}

const Subtask = ({taskId, sectionId, subtask}: SubtaskProps) => {
    const { id:boardId } = useParams();
    const { deleteSubTaskMutation, updateSubtaskMutation } = useTask({boardId:boardId, taskId:taskId});
    const [editMode, setEditMode] = useState(false)
    const [subtaskData, setSubtaskData] = useState(subtask)
    const { userRole } = useAuthStore();

    useEffect(() => {
        setSubtaskData(subtask)
    }, [subtask])
    
    const canEdit = userRole && ['owner', 'editor'].includes(userRole);
    const handleEditMode = () => {
        if (canEdit) setEditMode(true);
    };

    const handleDeleteSubtask = () => {
        deleteSubTaskMutation.mutate({sectionId, taskId, subtaskId:subtask._id as string})
    };

    return (
        <div className="p-2 flex items-center gap-2 rounded-xs hover:bg-base-100">
            <input 
                type="checkbox" 
                disabled={userRole === 'viewer'}
                checked={subtaskData.done} 
                onChange={(e) => {
                    setSubtaskData({ ...subtaskData, done:  e.currentTarget.checked });
                    updateSubtaskMutation.mutate({sectionId, taskId, subtaskData:{ ...subtaskData, done:  e.currentTarget.checked }})
                }}
            />

            <input 
                type="text" 
                value={subtaskData.sub_task}
                placeholder="Enter Task Name" 
                className={`w-full px-2 py-1 rounded-xs border-1 ${editMode ? 'bg-base-100 border-base-content/10' : 'border-base-content/0 cursor-pointer'} ${subtaskData.done && 'line-through'}`}
                readOnly={!editMode}
                onClick={() => handleEditMode()}
                onChange={(e)=> setSubtaskData({...subtaskData, sub_task: e.currentTarget.value})}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        updateSubtaskMutation.mutate(
                            {sectionId, taskId, subtaskData:{ ...subtaskData, done:  e.currentTarget.checked }},
                            { onSuccess : () => setEditMode(false)}
                        );
                    };
                }}
            />
            {editMode && (
                <div className='ml-auto hover:bg-error hover:text-error-content cursor-pointer p-[5px] rounded-xs'>
                    <X onClick={() => {setEditMode(false), setSubtaskData(subtask)}} size={15} />
                </div>
            )}
            
            { userRole !== 'viewer' && (
                <div className='hover:bg-error hover:text-error-content cursor-pointer p-[5px] rounded-xs'>
                    <Trash onClick={handleDeleteSubtask} size={15} />
                </div>  
            ) }  
        </div>
    );
};

export default Subtask