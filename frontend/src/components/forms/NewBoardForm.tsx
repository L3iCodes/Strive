import { useRef, useState } from "react"
import { useBoard } from "../../hooks/useBoard";

const templateChoice = {
    default: {name: "Kanban Page", desc:'Classic task management', sections: ['To-Do', 'In Progress', 'Review', 'Done']},
    project: {name: "Project Management", desc:'Comprehensive project workflow', sections: ['Backlog', 'Planning', 'Development', 'Testing', 'Complete']},
    simple: {name: "Simple Workflow", desc:'Minimal setup', sections: ['To Do', 'Doing', 'Done']},
    blank: {name: "Blank Board", desc:'Start with an empty board and create your own columns', sections: []},
} as const;

const NewBoardForm = () => {
    const [template, setTemplate] = useState<keyof typeof templateChoice>('default')
    const [boardData, setBoardData] = useState({name: '', desc: '', sections: templateChoice[template].sections})
    const dropDownRef = useRef<HTMLDetailsElement>(null);
    const { createBoardMutation } = useBoard();
 
    const handleBoardCreation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createBoardMutation.mutate(boardData);
        if(createBoardMutation.isSuccess){
            // Redirect to the board
        }
    };

    return (
        <form onSubmit={handleBoardCreation} className="w-full flex flex-col gap-5 text-xs">
            <div>
                <h1 className="font-bold text-xl">Create New Board</h1>
                <p className="text-xs text-base-content/50">Set up your new board with a template or start from scratch.</p>
            </div>
            <div className="w-full flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="font-medium">Board Name</span>
                    <input 
                        type="text" 
                        placeholder="Enter board name" 
                        required={true}
                        className="w-full px-2 py-2 rounded-xs border-1 border-base-content/10"
                        onChange={(e) => setBoardData({...boardData, name:e.currentTarget.value})}/>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="font-medium">Description</span>
                    <textarea 
                        placeholder="Enter board name" 
                        className="w-full h-[100px] px-2 py-2 rounded-xs border-1 border-base-content/10 resize-none"
                        onChange={(e) => setBoardData({...boardData, desc:e.currentTarget.value})}/>
                </label>

                <div className="flex flex-col gap-1">
                    <p className="font-medium">Choose a template</p>
                    <details ref={dropDownRef} className="dropdown w-full">
                        <summary className="btn w-full text-xs flex flex-col items-start gap-0 p-2 border-1 border-base-content/10">
                            <p className="font-medium">{templateChoice[template].name}</p>
                            <p className="text-[10px] font-light text-base-content/50">{templateChoice[template].desc}</p>
                        </summary>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm w-full text-xs border-1 border-base-content/10">
                            {Object.entries(templateChoice).map(([key, value]) => {
                                if(key as keyof typeof templateChoice !== template) return (
                                    <li className="font-medium border-b-1 border-base-content/10">
                                        <a onClick={() => {
                                                setTemplate(key as keyof typeof templateChoice);
                                                setBoardData({...boardData, sections:value.sections})
                                                dropDownRef.current?.removeAttribute("open");
                                            }} 
                                            className="flex flex-col gap-1 items-start"
                                        >
                                            <p className="font-medium">{value.name}</p>
                                            <p className="text-[10px] font-light text-base-content/50">{value.desc}</p>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </details>
                    {template !== "blank" && (
                        <div className="w-full flex flex-col p-2 gap-2 bg-base-200 border-1 border-base-content/5 rounded-xs">
                            <p>Columns that will be created:</p>
                            <div className="flex gap-1 flex-wrap">
                                {templateChoice[template].sections.map(section => (
                                    <p className="bg-base-100 p-1 px-2 rounded-md border-1 border-base-content/10">{section}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button type='submit' className="btn w-full" disabled={createBoardMutation?.isPending}>
                    {createBoardMutation?.isPending 
                        ? (<span className="loading loading-dots loading-xs"></span>) 
                        : 'Log In'
                    }
                </button>
            </div>
        </form>
    );
};

export default NewBoardForm
