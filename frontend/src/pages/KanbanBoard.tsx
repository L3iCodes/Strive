// Dependencies
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"

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
import { useAuthStore } from "../store/useAuthStore";
import { useCollab } from "../hooks/useCollab";
import { Check } from "lucide-react";

const KanbanBoard = () => {
    const navigate = useNavigate();
    const { id:boardId } = useParams();
    const { kanban:board, isKanbanLoading } = useBoard(boardId);
    const { requestAccessMutation } = useCollab(boardId as string)
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


    // Show when user does not have access to the board
    if(user && !board?.collaborators.some(collaborator => collaborator.user._id === user._id)) 
        return ( 
            <div className="w-full h-full flex flex-col gap-3 bg-base-100 items-center justify-center">
                <span className="loading loading-infinity loading-xl"></span>
                <p className="text-[20px] font-medium">You don't have access to this board</p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/')}
                        type="button" 
                        className="p-2 border-1 border-base-content/30 text-base-content/50 cursor-pointer hover:text-base-content hover:bg-base-300 active:bg-base-content/10"
                        >
                            Return
                    </button>

                    <button
                        type="button"
                        onClick={() => requestAccessMutation.mutate({boardId})}
                        disabled={requestAccessMutation.isPending || requestAccessMutation.isSuccess}
                        className={`p-2 rounded-xs border-1 border-base-content/30 font-bold
                                    ${requestAccessMutation.isSuccess 
                                        ? 'bg-success text-success-content cursor-not-allowed' 
                                        : 'bg-primary text-primary-content cursor-pointer hover:bg-primary/80 hover:text-primary-content active:bg-base-content/10 active:text-base-content'
                                    }`}
                    >
                        {requestAccessMutation.isPending && (
                            <h1 className="flex gap-2">
                                <span className="loading loading-dots loading-xs" />
                                Sending request
                            </h1>
                        )}
                        {requestAccessMutation.isSuccess && (
                            <h1 className="flex items-center gap-2">
                                <Check size={20} />
                                Request Sent
                            </h1>
                        )}
                        {!requestAccessMutation.isPending && !requestAccessMutation.isSuccess && 'Request Access'}
                    </button>
                </div>
            </div>
        )

    return (
        <div className="h-full flex flex-col gap-2">
            {isKanbanLoading
                ? (<BoardHeaderLoading />)
                : board && (<BoardHeader boardId={board._id} name={board.name} collaborators={board.collaborators} openManage={() => setIsTeamManagerOpen(s => !s)} />)
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