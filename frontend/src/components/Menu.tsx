import { Trash } from "lucide-react"
import { useBoard } from "../hooks/useBoard";
import { useParams } from "react-router-dom";

interface BoardMenuProps{
    boardId: string;
};

export const BoardMenu = ({ boardId }: BoardMenuProps) => {
    const { deleteBoardMutation } = useBoard(boardId);
    return (
        <div className="w-fit flex items-center bg-base-100 border-1 border-base-content/20 rounded-xs shadow-xl shadow-base-content/25 absolute right-2 top-2 text-base-content">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteBoardMutation.mutate({boardId});
                }}
                className="p-1 bg-base-300 text-error-content hover:bg-error active:bg-base-300">
                <Trash size={18} />
            </div>
        </div>
    )
}
