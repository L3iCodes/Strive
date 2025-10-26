import { ChevronLeft, LogOut, Move, Pen, Trash } from "lucide-react"
import { useBoard } from "../hooks/useBoard";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import { useSectionList } from "./Board";
import { useState } from "react";
import type { Task } from "../types";
import { useAuthStore } from "../store/useAuthStore";

interface BoardMenuProps{
    boardId: string;
    owner?: string;
    onLeave?: () => void;
};

interface TaskMenuProps{
    taskData: Task;
};

interface SectionMenu{
    onDelete: () => void;
    onEdit: () => void;
    onCollapse: () => void;
};

export const BoardMenu = ({ boardId, owner }: BoardMenuProps) => {
    const { deleteBoardMutation, leaveBoardMutation } = useBoard();
    const { user } = useAuthStore();
    const [ openConfirmation, setOpenConfirmation ] = useState(false);

    return (
        <div className="w-fit h-fit p-[2px] flex items-center justify-center bg-base-300 text-base-content border-1 border-base-content/30 rounded-xs shadow-2xs/0 absolute top-2 right-2 ">
            
            {!openConfirmation && (
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenConfirmation(true);
                    }}
                    className="flex gap-2 items-center p-1 hover:bg-error hover:text-error-content active:bg-error/50 text-xs cursor-pointer">
                    <Trash size={13} />
                    <p>{user?._id === owner ? 'Delete' : 'Leave'} Board</p>
                </div>
            )}
                
            {openConfirmation && (
                <div onClick={(e) => e.stopPropagation()} className="p-3 flex flex-col gap-3 absolute right-0 bg-base-300 top-2 rounded-xs text-base-content border-1 border-base-content/30">
                    <p className="text-xs">Are you sure you want to {user?._id === owner ? 'delete' : 'leave'} the board?</p>

                    <div className="flex gap-2">
                        <button 
                            type="button" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenConfirmation(false);
                            }} 
                            className="text-xs p-1 w-15 border-1 border-base-content/30 text-base-content/50 cursor-pointer hover:bg-base-100 hover:text-base-content active:bg-base-content/10"
                            >
                                Cancel
                        </button>

                        { user?._id === owner
                            ? 
                                (
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteBoardMutation.mutate(boardId);
                                        }}
                                        className="btn h-fit bg-base-100 p-1 w-15 rounded-xs border-1 text-xs border-base-content/30 cursor-pointer hover:bg-error hover:text-primary-content active:bg-base-content/10 active:text-base-content"
                                        disabled={deleteBoardMutation.isPending ? true : false}
                                        >
                                            {deleteBoardMutation.isPending 
                                                ? (<span className="loading loading-dots loading-xs"></span>)
                                                : ('Delete')
                                            }
                                    </button>
                                )
                            :   (
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            leaveBoardMutation.mutate({boardId});
                                        }}
                                        className="btn h-fit bg-base-100 p-1 w-15 rounded-xs border-1 text-xs border-base-content/30 cursor-pointer hover:bg-error hover:text-primary-content active:bg-base-content/10 active:text-base-content"
                                        disabled={leaveBoardMutation.isPending ? true : false}
                                        >
                                            {leaveBoardMutation.isPending 
                                                ? (<span className="loading loading-dots loading-xs"></span>)
                                                : ('Leave')
                                            }
                                    </button>
                                )
                        }
                        
                    </div>
                </div>
            )}
            
            
            
            {/* <div 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteBoardMutation.mutate(boardId);
                }}
                className="p-1 hover:bg-error hover:text-error-content active:bg-base-300">
                <Trash size={18} />
            </div> */}
        </div>
    );
}

export const TaskMenu = ({ taskData }: TaskMenuProps) => {
    const param = useParams();
    const { deleteTaskMutation, moveTaskMutation } = useTask({boardId:param.id, taskId:taskData._id as string});
    const [openMoveMenu, setOpenMoveMenu] = useState(false);
    
    const handleTaskManualMove = (receiverSectionId: string) => {
        moveTaskMutation.mutate({receiverSectionId, taskData})
    };

    return (
        <div className="w-fit h-fit p-[2px] flex items-center justify-center bg-base-300 text-base-content rounded-xs shadow-2xs/0 absolute top-2 right-2 z-50 border-1 border-base-content/30">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMoveMenu(s => !s);
                }}
                className="p-1 hover:bg-warning hover:text-warning-content active:bg-base-300">
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
        <div className="w-[100px] h-fit p-[2px] flex flex-col justify-center bg-base-300 text-base-content rounded-xs border-1 border-base-content/30 shadow-2xs/0 absolute top-7 right-0 z-50">
            {sectionList?.map(section => (
                section._id !== sectionId && (
                <p 
                    onClick={(e) => {
                        e.stopPropagation();
                        onMove(section._id);
                    }}
                    className="p-1 hover:bg-base-100 truncate">
                    {section.name}
                </p>)
            ))}    
        </div>
    );
};

export const SectionMenu = ({onCollapse, onEdit, onDelete}: SectionMenu) => {
    return (
        <div className="w-[120px] h-fit p-[2px] flex flex-col bg-base-300 text-base-content rounded-xs shadow-md absolute top-8 right-0 border-1 border-accent z-100">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onCollapse();
                }}
                className="flex gap-2 items-center p-1 hover:bg-success hover:text-success-content active:bg-success/50 text-xs cursor-pointer">
                <ChevronLeft size={13} />
                <p>Collapse</p>
            </div>

            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                className="flex gap-2 items-center p-1 hover:bg-warning hover:text-warning-content active:bg-warning/50 text-xs cursor-pointer">
                <Pen size={13} />
                <p>Edit</p>
            </div>

            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="flex gap-2 items-center p-1 hover:bg-error hover:text-error-content active:bg-error/50 text-xs cursor-pointer">
                <Trash size={13} />
                <p>Delete</p>
            </div>

        </div>
    );
};

export const BoardMenu2 = ({ onLeave }: BoardMenuProps) => {
    return (
        <div className="w-[140px] h-fit p-[2px] flex flex-col bg-base-300 text-base-content rounded-xs shadow-md absolute top-30 md:top-15 right-5 border-1 border-base-content/30 z-100">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onLeave && onLeave();
                }}
                className="flex gap-2 items-center p-1 hover:bg-error hover:text-error-content active:bg-error/50 text-xs cursor-pointer">
                <LogOut size={13} />
                <p>Leave Board</p>
            </div>

        </div>
    );
};