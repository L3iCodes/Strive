// Dependencies
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"

// Components
import { getKanbanBoard } from "../apis/board.api";
import { BoardHeader, BoardHeaderLoading } from "../components/BoardHeader";
import Board from "../components/Board";

// Store
import { type BoardProps } from "../store/useKanbanStore";


const KanbanBoard = () => {
    const param = useParams();
    
    const { data, isLoading } = useQuery<BoardProps>({
        queryKey: ['kanban', param.id],   // include the id in the key
        queryFn: () => getKanbanBoard(param.id as string),
    });

    // if(data){
    //     console.log(data)
    // }
    return (
        <div className="h-full flex flex-col gap-2">
            {isLoading
                ? (<BoardHeaderLoading />)
                : data && (<BoardHeader name={data.name} collaborators={data.collaborators} />)
            }

            <Board board={data!} />
        </div>
    )
}
export default KanbanBoard