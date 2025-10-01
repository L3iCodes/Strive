import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { getKanbanBoard } from "../apis/board.api";
import BoardHeader, { BoardHeaderLoading } from "../components/BoardHeader";


const KanbanBoard = () => {
    const param = useParams();
    
    const { data, isLoading } = useQuery({
        queryKey: ['kanban', param.id],   // include the id in the key
        queryFn: () => getKanbanBoard(param.id as string),
    });

    return (
        <div className="h-full flex flex-col gap-2">
            {isLoading
                ? (<BoardHeaderLoading />)
                : (<BoardHeader name={data?.name} collaborators={data?.collaborators} />)
            }
        </div>
    )
}
export default KanbanBoard
