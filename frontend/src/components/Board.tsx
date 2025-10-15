import { createContext, useContext, useEffect, useState } from "react";
import { closestCorners, DndContext} from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import SectionComponent from "./Section";
import NewSectionForm from "./forms/NewSectionForm";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import { useDrag } from "../hooks/useDrag";

const Board = () => {
    const param = useParams();
    const { kanban:board } = useBoard(param.id as string);
    const { sensors, handleDragStart } = useDrag();
    const { setUserRole } = useAuthStore();
    const [sectionList, setSectionList] = useState<SectionItem[]>([])
    const [openNewSection, setOpenNewSection] = useState<boolean>(false);
    
    // Set user role
    useEffect(() => {
        if(board) setUserRole(board?.owner, board?.collaborators);
    }, [board])
    
    // Set section list
    useEffect(() => {
        setSectionList(
            board?.sections?.map((section) => ({
                _id: section._id,
                name: section.name,
            })) || []
        );
    }, [board]);

    return (
        // Context for section list, used in task component
        <SectionListContext.Provider value={{ sectionList }}> 
            <div className="w-full h-full flex gap-3 overflow-y-auto ">
                <DndContext sensors={sensors} onDragStart={handleDragStart} collisionDetection={closestCorners}>
                    <SortableContext items={(board?.sections || []).map(section => `section-${section._id}`)} strategy={horizontalListSortingStrategy} >
                        {board?.sections?.map(section => (
                            <SectionComponent 
                                key={section._id} 
                                section={section} 
                                id={`section-${section._id}`}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {openNewSection 
                    ? (<NewSectionForm onClose={() => setOpenNewSection(false)}/>)
                    : (<button onClick={() => setOpenNewSection(true)} className="btn w-[230px] btn-dash btn-primary"> New Section</button>)
                }
            </div>
            
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