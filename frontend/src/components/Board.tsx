import { createContext, useContext, useEffect, useState } from "react";
import type { BoardProps, Section } from "../types";

import SectionComponent from "./Section";
import NewSectionForm from "./forms/NewSectionForm";
import TaskPreview from "./TaskPreview";
import { useTaskStore } from "../store/useTaskStore";

interface BoardComponentProps {
  board: BoardProps;
}

const Board = ({board}: BoardComponentProps) => {
    const [sectionList, setSectionList] = useState<SectionItem[]>([])
    const { setPreview, isPreviewOpen, setTask } = useTaskStore();

    // Reset task preview
    useEffect(() => {
        setPreview(false),
        setTask(null);
    }, [])


    // Set section list
    useEffect(() => {
        setSectionList(
            board?.sections?.map((section) => ({
                _id: section._id,
                name: section.name,
            })) || []
        );
    }, [board]);

    const [openNewSection, setOpenNewSection] = useState<boolean>(false);

    return (
        // Context for section list, used in task component
        <SectionListContext.Provider value={{ sectionList }}> 
            <div className="w-full h-full flex gap-3 overflow-y-auto">
                {board?.sections?.map(section => (
                    <SectionComponent key={section._id} section={section} />
                ))}

                {openNewSection 
                    ? (<NewSectionForm onClose={() => setOpenNewSection(false)}/>)
                    : (<button onClick={() => setOpenNewSection(true)} className="btn w-[230px] btn-dash btn-primary"> New Section</button>)
                }
            </div>
            
            { isPreviewOpen &&
                <TaskPreview />
            }
            
        </SectionListContext.Provider>
    );
};




// Section list context for TaskMenu (move function for task)
interface SectionItem {
    _id: string;
    name: string;
}

interface SectionListContextProps{
    sectionList: SectionItem[] | null;
};

const SectionListContext = createContext<SectionListContextProps | null>(null);
export const useSectionList = () => {
    const ctx = useContext(SectionListContext);
    if (!ctx) throw new Error("useSectionList must be used within SectionListProvider");
    return ctx;
};

export default Board