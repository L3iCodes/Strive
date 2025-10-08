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
import type { BoardProps } from "../types";
import { useEffect, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

const KanbanBoard = () => {
    const param = useParams();
    const { setPreview, setTask } = useTaskStore();
    const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
    
    const { data, isLoading } = useQuery<BoardProps>({
        queryKey: ['kanban', param.id],   // include the id in the key
        queryFn: () => getKanbanBoard(param.id as string),
    });

    // Reset task preview
    useEffect(() => {
        return(() => {
            setPreview(false),
            setTask(null);
        })
    }, [])
    
    return (
        <div className="h-full flex flex-col gap-2">
            {isLoading
                ? (<BoardHeaderLoading />)
                : data && (<BoardHeader name={data.name} collaborators={data.collaborators} openManage={() => setIsTeamManagerOpen(s => !s)} />)
            }

            <Board board={data!} />

            <TeamManager
                boardName={data?.name} 
                owner={data?.owner}
                collaborators={data?.collaborators}
                isTeamManagerOpen={isTeamManagerOpen} 
                closeTeamManager={() => setIsTeamManagerOpen(false)}  
            />

            <TaskPreview />
        </div>
    )
}
export default KanbanBoard