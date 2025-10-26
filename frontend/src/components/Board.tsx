import { createContext, useContext, useEffect, useState } from "react";
import { closestCorners, DndContext, DragOverlay} from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import SectionComponent from "./Section";
import NewSectionForm from "./forms/NewSectionForm";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import { useDrag } from "../hooks/useDrag";

import TaskComponent from "./Task";
import type { BoardProps, Section, Task } from "../types";
import { useSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

interface BoardPropsVariable {
    board: BoardProps | undefined;
}
const Board = ({board}:BoardPropsVariable) => {
    const {id: boardId} = useParams();
    const { sensors, handleDragStart, handleDragEnd, activeDragItem, activeDragId } = useDrag();
    const { setUserRole, userRole } = useAuthStore();
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const [sectionList, setSectionList] = useState<SectionItem[]>([])
    const [openNewSection, setOpenNewSection] = useState<boolean>(false);

    // Join Board Room
    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            socket.emit('JOIN_BOARD', boardId);
        };

        // If already connected, join immediately
        if (socket.connected) {
            handleConnect();
        } else {
            socket.on('connect', handleConnect);
        }

        return () => {
            socket.emit('LEAVE_BOARD', boardId);
            socket.off('connect', handleConnect);
        };
    }, [socket, boardId]);

    useEffect(() => {
        if(!socket || !boardId) return;
       
        // Ignore for own update
        const handleBoardUpdate = (payload: { board: BoardProps; socketId: string }) => {
            if (payload.socketId === socket.id) {
                return;
            }
            
            // Force deep clone to ensure new reference
            queryClient.setQueryData(['kanban', boardId], payload.board);
        };
       
        socket.on('UPDATE_BOARD', handleBoardUpdate);
       
        return () => {
            socket.off('UPDATE_BOARD', handleBoardUpdate);
        };
    }, [socket, boardId, queryClient]);

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
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                    <SortableContext items={(board?.sections || []).map(section => `section-${section._id}`)} strategy={horizontalListSortingStrategy} >
                        {board?.sections?.map(section => (
                            <SectionComponent 
                                key={section._id} 
                                section={section} 
                                id={`section-${section._id}`}
                            />
                        ))}
                    </SortableContext>

                    {/* Handles task card overlay  */}
                    <DragOverlay>
                        {activeDragId && activeDragId.startsWith('task-') && activeDragItem && (
                            <TaskComponent task={activeDragItem as Task} id={activeDragId} className="!border-primary" />
                        )}

                        {activeDragId && activeDragId.startsWith('section-') && activeDragItem && (
                            <SectionComponent section={activeDragItem as Section} id={activeDragId} className="!border-primary"/>
                        )}
                    </DragOverlay>
                </DndContext>

                {userRole !== 'viewer' && (
                    openNewSection
                    ? (<NewSectionForm onClose={() => setOpenNewSection(false)}/>)
                    : (<button onClick={() => setOpenNewSection(true)} className="btn w-[230px] btn-dash btn-primary"> New Section</button>)
                )}
               
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