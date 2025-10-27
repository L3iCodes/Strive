// Dependencies
import { useParams } from "react-router-dom"

// Components
import { BoardHeader, BoardHeaderLoading } from "../components/BoardHeader";
import Board from "../components/Board";
import TeamManager from "../components/TeamManager";
import TaskPreview from "../components/TaskPreview";

// Store
import { useEffect, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useBoard } from "../hooks/useBoard";
import { useAuthStore } from "../store/useAuthStore";
import RequestAccess from "../components/RequestAccess";

const KanbanBoard = () => {
    const { id:boardId } = useParams();
    const { kanban:board, isKanbanLoading } = useBoard(boardId);
    const { user } = useAuthStore();
    const { setPreview, setTask } = useTaskStore();
    const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
    
    // Reset task preview
    useEffect(() => {
        return(() => {
            setPreview(false),
            setTask(null);
        })
    }, [])

    // Show loading while fetching board data
    if (isKanbanLoading) {
        return (
            <div className="h-full flex flex-col gap-2">
                <BoardHeaderLoading />
            </div>
        );
    };

    // Show when user does not have access to the board
    if(user && !board?.collaborators.some(collaborator => collaborator.user._id === user._id)) 
        return(
            <RequestAccess />
        )
    ;

    // Show kanban board
    if(board)
        return (
            <div className="h-full flex flex-col gap-2">
                <BoardHeader boardId={board._id} name={board.name} collaborators={board.collaborators} openManage={() => setIsTeamManagerOpen(s => !s)} />

                <Board board={board}/>

                <TeamManager
                    boardName={board?.name} 
                    owner={board?.owner}
                    collaborators={board?.collaborators}
                    isTeamManagerOpen={isTeamManagerOpen} 
                    closeTeamManager={() => setIsTeamManagerOpen(false)}  
                />

                <TaskPreview />
            </div>
        )
    ;
}
export default KanbanBoard