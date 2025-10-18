import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import type { BoardSummary } from "../types";
import { useState } from "react";
import { BoardMenu } from "./Menu";

interface CardProps {
  board: BoardSummary;
}

const Card = ({board}: CardProps) => {
    const navigate = useNavigate();
    const { user } = useAuthStore()
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div 
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
            onClick={() => navigate(`/board/${board._id}`)} 
            className="relative w-full h-[200px] flex p-2 item flex-col border-[1.5px] border-base-content/10 rounded-xs cursor-pointer hover:bg-base-300/30 active:bg-base-300"
        >
            {openMenu && (<BoardMenu boardId={board._id} />)}
            
            <div className="flex items-center">
                <h1 className="font-medium">{board.name}</h1>
                {user?._id !== board.owner && (
                    <p className="py-1 px-2 ml-auto text-xs rounded-xs bg-base-300">Shared</p>
                )}
            </div>
            <textarea disabled={true} className="resize-none w-[90%] text-xs line-clamp-2" value={board.desc} />

            <div className="mt-auto">
                <p className="text-xs font-medium">Progress ({board.doneTasks}/{board.totalTasks})</p>
                <progress className="progress w-full" value={board.doneTasks} max={board.totalTasks}></progress>
            </div>

            <div className="w-full flex mt-2 items-center gap-2 h-5">
                <p className="text-xs">Team</p>
                <div className="h-[25px] w-full flex gap-1 relative">
                    {board.collaborators.map((collaborator, index) => (
                        collaborator.status !== 'pending' &&
                        <img 
                            key={collaborator._id}
                            src={collaborator.avatar}
                            className={`w-6 h-6 object-cover border-1 border-primary rounded-2xl absolute`}
                            style={{ right: `${index * 13}px` }}
                        />
                    ))}
                </div>
            </div>

            <p className="text-[10px] mt-2 text-base-content/40">Last updated {board.lastOpened as string}</p>
        </div>
    );
};

export default Card;