// Dependencies
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"

// Components
import { getKanbanBoard } from "../apis/board.api";
import { BoardHeader, BoardHeaderLoading } from "../components/BoardHeader";
import Board from "../components/Board";
import TeamManager from "../components/TeamManager";
import TaskPreview from "../components/TaskPreview";

// Store
import { useEffect, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useBoard } from "../hooks/useBoard";

const KanbanBoard = () => {
    const param = useParams();
    const { kanban:board, isKanbanLoading } = useBoard(param.id as string);
    const { setPreview, setTask } = useTaskStore();
    const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
    
    // Reset task preview
    useEffect(() => {
        return(() => {
            setPreview(false),
            setTask(null);
        })
    }, [])
    
    return (
        <div className="h-full flex flex-col gap-2">
            {isKanbanLoading
                ? (<BoardHeaderLoading />)
                : board && (<BoardHeader name={board.name} collaborators={board.collaborators} openManage={() => setIsTeamManagerOpen(s => !s)} />)
            }

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
}
export default KanbanBoard