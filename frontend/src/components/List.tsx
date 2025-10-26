import { useState } from "react";
import type{ BoardSummary } from "../types";
import { BoardMenu } from "./Menu";
import { useNavigate } from "react-router-dom";

interface ListProps {
  board: BoardSummary;
}

const List = ({board}: ListProps) => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div 
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
            onMouseOver={() => () => setOpenMenu(true)}
            onClick={() => navigate(`/board/${board._id}`)} 
            className="relative w-full h-[60px] items-center p-3 grid grid-cols-3  border-[1.5px] border-base-content/10 rounded-xs cursor-pointer hover:bg-base-300/30 active:bg-base-300"
        >
            {openMenu && (<BoardMenu boardId={board._id} />)}
            <div className="flex flex-col leading-0">
                <h1 className="text-xs font-medium">{board.name}</h1>
                <p className="text-[10px] mt-2 text-base-content/40">Last Modified {new Date(board.lastOpened).toISOString().split("T")[0]}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-xs font-medium">Progress ({board.doneTasks}/{board.totalTasks})</p>
                <progress className="progress w-full" value={board.doneTasks} max={board.totalTasks}></progress>
            </div>
            <div className="w-full flex mt-2 items-center gap-2 h-5">
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
        </div>
    );
};

export default List
