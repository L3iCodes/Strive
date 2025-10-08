import { ChevronRight, Ellipsis, Plus } from "lucide-react";
import type { Section } from "../types";
import { useRef, useState } from "react";
import NewTaskForm from "./forms/NewTaskForm";
import TaskComponent from "./Task";
import { useSection } from "../hooks/useSection";
import { useParams } from "react-router-dom";
import { SectionMenu } from "./Menu";

interface SectionComponentProps{
    section: Section;
}

const SectionComponent = ({section}: SectionComponentProps) => {
    const param = useParams();
    const { deleteSectionMutation, updateSectionMutation } = useSection(param.id as string);
    const [showAddTaskTop, setShowAddTaskTop] = useState<boolean>(false);
    const [showAddTaskBot, setShowAddTaskBot] = useState<boolean>(false);
    const [openSectionMenu, setOpeSectionMenu] = useState<boolean>(false);
    const [isSectionCollapse, setIsSectionCollapse] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [sectionName, setSectionName] = useState(section?.name);
    const inputRef = useRef<HTMLInputElement>(null);

    if(isSectionCollapse)
        return(
            <div className="h-full w-[50px] p-2 flex items-center shrink-0 flex-col gap-2 rounded-xs border-1 border-base-content/10 bg-base-300 overflow-y-auto relative transition-all duration-200 overflow-hidden">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSectionCollapse(s => !s);
                    }}
                    className=" flex gap-2 items-center p-1 hover:bg-primary hover:text-primary-content active:bg-primary/50 text-xs cursor-pointer border-1 border-base-content/10">
                    <ChevronRight size={18} />
                </div>

                <h2 className="text-[14px] px-1 font-medium truncate rotate-90 mt-15">{section.name}</h2>

                <p className="text-xs mt-20">{section.tasks.length}</p>
            </div>
        );


    return (
        <>
            <div className="h-full w-[230px] p-2 pt-0 flex shrink-0 flex-col gap-2 rounded-xs border-1 border-base-content/10 bg-base-300 overflow-y-auto relative transition-all duration-200">
                {/* Section Header */}
                <div className="py-[5px] flex w-full items-center bg-base-300 border-b-1 border-base-content/20 sticky top-0 z-10">
                    <input 
                        type="text"
                        ref={inputRef} 
                        placeholder="Board Name"
                        value={sectionName} 
                        readOnly={!editMode}
                        className={`input text-[14px] h-fit !p-[1px] font-medium max-w-[60%] truncate w-full rounded-xs ${editMode ? 'cursor-text border-1 border-base-content/20 bg-base-100' : 'border-0 cursor-pointer bg-base-300 !px-0'}`}
                        onChange={(e) => setSectionName(e.currentTarget.value)}
                        onClick={() => setEditMode(true)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                if(sectionName.trim() === ""){
                                    setSectionName(s => s = 'Section')
                                }
                                updateSectionMutation.mutate(
                                    {sectionId:section._id, sectionName: sectionName},
                                    { onError: () => setSectionName(section.name)}
                                );
                                setEditMode(false);
                            };
                        }}
                    />
                    
                    <p className="text-xs ml-2 ">{section.tasks.length}</p>
                    <div className="ml-auto flex gap-1">
                        <div className="rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-200">
                            <Plus onClick={() => {setShowAddTaskTop(s => !s), setShowAddTaskBot(false);}} size={18} className="cursor-pointer"/>
                        </div>
                        <div className={`rounded-xs hover:bg-primary hover:text-primary-content active:bg-base-200 ${openSectionMenu && 'bg-primary text-primary-content'}  `}>
                            {/* <Ellipsis onClick={() => deleteSectionMutation.mutate(section._id)} size={18} className="cursor-pointer"/> */}
                            <Ellipsis onClick={() => setOpeSectionMenu(s => !s)} size={18} className="cursor-pointer"/>
                        </div>
                        {openSectionMenu && (
                            <SectionMenu 
                                onCollapse={() => {setIsSectionCollapse(true), setOpeSectionMenu(false)}}
                                onEdit={() => {setEditMode(true), setOpeSectionMenu(false), inputRef.current?.focus()}}
                                onDelete={() => deleteSectionMutation.mutate(section._id)}
                            />
                        )}
                    </div>
                </div>
                
                <div onClick = {() => setOpeSectionMenu(false)} className="w-full h-full flex flex-col gap-2">
                    {/* Show new task form on top */}
                    {showAddTaskTop && (<NewTaskForm onClose={() => setShowAddTaskTop(false)} sectionId={section._id as string} position="top"/>)}

                    {section.tasks?.map(task => (
                        <TaskComponent key={task._id} task={task} />
                    ))}
                    
                    {/* Section Body */}
                    {showAddTaskBot
                        ?   (<NewTaskForm onClose={() => {setShowAddTaskBot(false)}} sectionId={section._id as string} position="bot"/>)
                        :   (
                                <button 
                                    onClick={() => {setShowAddTaskBot(true), setShowAddTaskTop(false)}}
                                    className="w-full p-[5px] flex items-center gap-2 text-xs cursor-pointer hover:bg-primary hover:text-primary-content rounded-xs"
                                    >
                                        <Plus size={15}/>
                                        Add Task
                                </button>
                            )
                    }
                </div>
                
            </div>
        </>
    );
};

export default SectionComponent