import { useAuthStore } from "../store/useAuthStore";
import { useBoardStore, type BoardSummary } from "../store/useBoardStore";

interface CardProps {
  board: BoardSummary;
}

const Card = ({board}: CardProps) => {
    const { user } = useAuthStore()

    return (
        <div className="w-full h-[200px] flex p-2 item flex-col border-[1.5px] border-base-content/10 rounded-xs cursor-pointer hover:bg-base-300/30 active:bg-base-300">
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

            <div className="w-full flex mt-2 items-center gap-2">
                <p className="text-xs">Team</p>
                <div className="w-full flex gap-1 relative justify-end">
                    {board.collaborators.map((collaborator) => (
                        <img 
                            key={collaborator._id}
                            src={collaborator.avatar}
                            className="w-6 h-6 object-cover border-1 border-primary rounded-2xl "
                        />
                    ))}
                </div>
            </div>

            <p className="text-[10px] mt-2 text-base-content/40">Last updated {board.lastOpened as string}</p>
        </div>
    );
};

export default Card;