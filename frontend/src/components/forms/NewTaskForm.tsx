import { useState } from "react";
import { useTask } from "../../hooks/useTask";
import { useParams } from "react-router-dom";

interface NewTaskFormProps  {
    sectionId: string;
    position: string;
    onClose: () => void;
}

const NewTaskForm = ({sectionId, onClose, position}: NewTaskFormProps) => {
    const params = useParams();
    const [task, setTask] = useState({name: "", desc: ""});
    const { createTaskMutation } = useTask(params.id as string);

    const handleNewTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
  
        createTaskMutation.mutate(
            {boardId:params.id, sectionId, ...task, position},
            {onSuccess() {
                onClose()
            },}
        );
    };

    return (
        <form onSubmit={handleNewTask} className="w-full border-1 border-base-content/20 rounded-xs text-xs p-1 space-y-1">
            <input 
                type="text" 
                placeholder="Enter Task Name" 
                className="w-full px-2 py-1 rounded-xs border-1 bg-base-100 border-base-content/10"
                onChange={(e)=> setTask({...task, name: e.currentTarget.value})}
            />
            <textarea 
                placeholder="Enter Description" 
                className="w-full px-2 py-1 rounded-xs border-1 bg-base-100 border-base-content/10 h-20 resize-none"
                onChange={(e)=> setTask({...task, desc: e.currentTarget.value})}
            />
            <div className="ml-auto flex w-fit gap-2">
                <button onClick={onClose} className="p-1 w-15 border-1 border-base-content/30 text-base-content/50 cursor-pointer hover:bg-base-100 hover:text-base-content active:bg-base-content/10">Cancel</button>
                <button 
                    type="submit" 
                    className="btn h-fit bg-base-100 p-1 w-20 rounded-xs border-1 border-base-content/30 cursor-pointer hover:bg-primary hover:text-primary-content active:bg-base-content/10 active:text-base-content"
                    disabled={createTaskMutation.isPending ? true : false}
                    >
                        {createTaskMutation.isPending 
                            ? (<span className="loading loading-dots loading-xs"></span>)
                            : ('Save')
                        }
                </button>
            </div>
        </form>
    );
};
export default NewTaskForm
