import { type BoardProps } from "../store/useKanbanStore"
import SectionComponent from "./Section";

interface BoardComponentProps {
  board: BoardProps;
}

const Board = ({board}: BoardComponentProps) => {
    return (
        <div className="w-full h-full flex gap-3 overflow-y-auto ">
            {board?.sections?.map(section => (
                <SectionComponent key={section._id} section={section} />
            ))}

            <button className="btn w-[230px] btn-dash btn-primary"> New Section</button>
        </div>
    );
};

export default Board