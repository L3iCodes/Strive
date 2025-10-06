import { Move, Trash } from "lucide-react"
import { useBoard } from "../hooks/useBoard";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import { useSectionList } from "./Board";
import { useState } from "react";

interface BoardMenuProps{
    boardId: string;
};

interface TaskMenuProps{
    sectionId: string;
    taskId: string;
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


export const TaskMenu = ({ sectionId, taskId }: TaskMenuProps) => {
    const param = useParams();
    const { deleteTaskMutation } = useTask({boardId:param.id});
    const [openMoveMenu, setOpenMoveMenu] = useState(false);
    
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
                    deleteTaskMutation.mutate({sectionId, taskId});
                }}
                className="p-1 hover:bg-error hover:text-error-content active:bg-base-300">
                <Trash size={13} />
            </div>

            {openMoveMenu && <MoveMenu sectionId={sectionId}/>}
        </div>
    );
};

export const MoveMenu = ({ sectionId }: { sectionId: string }) => {
    const { sectionList } = useSectionList();

    if(sectionList && sectionList?.length < 2) return;

    return (
        <div className="w-[100px] h-fit p-[2px] flex flex-col justify-center bg-base-content text-base-300 rounded-xs shadow-2xs/0 absolute top-7 right-0 z-50">
            {sectionList?.map(section => (
                section._id !== sectionId && (
                <p 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-base-100/20 truncate">
                    {section.name}
                </p>)
            ))}    
        </div>
    );
};