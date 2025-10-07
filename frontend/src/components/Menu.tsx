import { Move, Trash } from "lucide-react"
import { useBoard } from "../hooks/useBoard";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import { useSectionList } from "./Board";
import { useState } from "react";
import type { Task } from "../types";

interface BoardMenuProps{
    boardId: string;
};

interface TaskMenuProps{
    sectionId: string;
    taskData: Task;
};

export const BoardMenu = ({ boardId }: BoardMenuProps) => {
    const { deleteBoardMutation } = useBoard();
    return (
        <div className="w-fit h-fit p-[2px] flex items-center justify-center bg-base-content text-base-300 rounded-xs shadow-2xs/0 absolute top-2 right-2 ">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteBoardMutation.mutate(boardId);
                }}
                className="p-1 hover:bg-error hover:text-error-content active:bg-base-300">
                <Trash size={18} />
            </div>
        </div>
    );
}


export const TaskMenu = ({ sectionId, taskData }: TaskMenuProps) => {
    const param = useParams();
    const { deleteTaskMutation, moveTaskMutation } = useTask({boardId:param.id, taskId:taskData._id as string});
    const [openMoveMenu, setOpenMoveMenu] = useState(false);
    
    const handleTaskManualMove = (receiverSectionId: string) => {
        moveTaskMutation.mutate({receiverSectionId, taskData})
    };

    return (
        <div className="w-fit h-fit p-[2px] flex items-center justify-center bg-base-content text-base-300 rounded-xs shadow-2xs/0 absolute top-2 right-2 z-50">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMoveMenu(s => !s);
                }}
                className="p-1 hover:bg-warning hover:text-error-content active:bg-base-300">
                <Move size={13} />
            </div>

            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTaskMutation.mutate({sectionId:taskData.section, taskId:taskData._id as string});
                }}
                className="p-1 hover:bg-error hover:text-error-content active:bg-base-300">
                <Trash size={13} />
            </div>

            {openMoveMenu && <MoveMenu sectionId={taskData.section} onMove={(sectionId) => handleTaskManualMove(sectionId)}/>}
        </div>
    );
};

export const MoveMenu = ({ sectionId, onMove }: { sectionId: string, onMove:(sectionId: string)=>void }) => {
    const { sectionList } = useSectionList();

    if(sectionList && sectionList?.length < 2) return;

    return (
        <div className="w-[100px] h-fit p-[2px] flex flex-col justify-center bg-base-content text-base-300 rounded-xs shadow-2xs/0 absolute top-7 right-0 z-50">
            {sectionList?.map(section => (
                section._id !== sectionId && (
                <p 
                    onClick={(e) => {
                        e.stopPropagation();
                        onMove(section._id);
                    }}
                    className="p-1 hover:bg-base-100/20 truncate">
                    {section.name}
                </p>)
            ))}    
        </div>
    );
};