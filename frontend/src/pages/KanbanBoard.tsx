// Dependencies
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"

// Components
import { getKanbanBoard } from "../apis/board.api";
import { BoardHeader, BoardHeaderLoading } from "../components/BoardHeader";
import Board from "../components/Board";
import TeamManager from "../components/TeamManager";

// Store
import type { BoardProps } from "../types";
import { useState } from "react";

const KanbanBoard = () => {
    const param = useParams();
    const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
    
    const { data, isLoading } = useQuery<BoardProps>({
        queryKey: ['kanban', param.id],   // include the id in the key
        queryFn: () => getKanbanBoard(param.id as string),
    });
    
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
            
        </div>
    )
}
export default KanbanBoard