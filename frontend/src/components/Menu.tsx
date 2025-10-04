import { Trash } from "lucide-react"
import { useBoard } from "../hooks/useBoard";

interface BoardMenuProps{
    boardId: string;
};

export const BoardMenu = ({ boardId }: BoardMenuProps) => {
    const { deleteBoardMutation } = useBoard();
    return (
        <div className="w-fit h-fit p-[2px] flex items-center justify-center bg-base-content text-base-300 rounded-xs shadow-2xs/0 absolute top-2 right-2 ">
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteBoardMutation.mutate(boardId);
                }}
                className="p-1 hover:bg-error hover:text-error-content active:bg-base-300">
                <Trash size={18} />
            </div>
        </div>
    );
}
