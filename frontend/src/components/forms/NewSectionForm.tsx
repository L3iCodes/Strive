import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSection } from "../../hooks/useSection";

interface NewSectionFormProps  {
    onClose: () => void;
}

const NewSectionForm = ({onClose}: NewSectionFormProps) => {
    const param = useParams();
    const { createSectionMutation } = useSection(param.id as string);
    const [sectionName, setSectionName] = useState("")
    

    const handleSectionCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        createSectionMutation.mutate({ boardId: param.id, sectionName });
        if(createSectionMutation.isSuccess){
            onClose();
        };
    };

    return (
        <form onSubmit={handleSectionCreation} className="w-[230px] h-fit border-1 border-base-content/20 rounded-xs text-xs p-1 space-y-1 shrink-0">
            <input 
                    type="text" 
                    placeholder="Enter Task Name" 
                    className="w-full p-2 rounded-xs border-1 bg-base-100 border-base-content/10"
                    onChange={(e) => setSectionName(e.currentTarget.value)}
                />
            <div className="ml-auto flex w-fit gap-2">
                <button onClick={onClose} className="p-1 w-15 border-1 border-base-content/30 text-base-content/50 cursor-pointer hover:bg-base-100 hover:text-base-content active:bg-base-content/10">Cancel</button>
                <button 
                    type="submit" 
                    className="btn h-fit bg-base-100 p-1 w-20 rounded-xs border-1 border-base-content/30 cursor-pointer hover:bg-primary hover:text-primary-content active:bg-base-content/10 active:text-base-content"
                    disabled={createSectionMutation.isPending ? true : false}
                    >   {createSectionMutation.isPending 
                            ? (<span className="loading loading-dots loading-xs"></span>)
                            : ('Save')
                        }
                </button>
            </div>
        </form>
    );
};

export default NewSectionForm
