import { Ellipsis, Plus } from "lucide-react";
import type { Section } from "../types";
import { useState } from "react";
import NewTaskForm from "./forms/NewTaskForm";
import TaskComponent from "./Task";
import { useSection } from "../hooks/useSection";
import { useParams } from "react-router-dom";

interface SectionComponentProps{
    section: Section;
}

const SectionComponent = ({section}: SectionComponentProps) => {
    const param = useParams();
    const { deleteSectionMutation } = useSection(param.id as string);
    const [showAddTaskTop, setShowAddTaskTop] = useState<boolean>(false);
    const [showAddTaskBot, setShowAddTaskBot] = useState<boolean>(false);

    return (
        <div className="h-full w-[230px] p-2 pt-0 flex shrink-0 flex-col gap-2 rounded-xs border-1 border-base-content/10 bg-base-300 overflow-y-auto relative">
            {/* Section Header */}
            <div className="p-[5px] flex w-full items-center bg-base-300 border-b-1 border-base-content/20 sticky top-0 z-10">
                <h2 className="text-[14px] font-medium">{section.name}</h2>
                <div className="ml-auto flex gap-1">
                    <Plus onClick={() => {setShowAddTaskTop(s => !s), setShowAddTaskBot(false);}} 
                        size={18} className="cursor-pointer"/>
                    <Ellipsis onClick={() => deleteSectionMutation.mutate(section._id)} size={18} className="cursor-pointer"/>
                </div>
            </div>

            {/* Show new task form on top */}
            {showAddTaskTop && (<NewTaskForm onClose={() => setShowAddTaskTop(false)} sectionId={section._id as string} position="top"/>)}

            {section.tasks?.map(task => (
                <TaskComponent key={task._id} task={task} />
            ))}

            
            {/* Section Body */}
            {showAddTaskBot
                ? (<NewTaskForm onClose={() => {setShowAddTaskBot(false)}} sectionId={section._id as string} position="bot"/>)
                : (<button onClick={() => {setShowAddTaskBot(true), setShowAddTaskTop(false)}}className="btn btn-dash btn-primary">Add Task</button>)
            }
        </div>
    )
}

export default SectionComponent