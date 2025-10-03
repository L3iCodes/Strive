import { useState } from "react";
import type { BoardProps } from "../types";

import SectionComponent from "./Section";
import NewSectionForm from "./forms/NewSectionForm";

interface BoardComponentProps {
  board: BoardProps;
}

const Board = ({board}: BoardComponentProps) => {
    const [openNewSection, setOpenNewSection] = useState<boolean>(false);
    console.log(board)
    return (
        <div className="w-full h-full flex gap-3 overflow-y-auto ">
            {board?.sections?.map(section => (
                <SectionComponent key={section._id} section={section} />
            ))}

            {openNewSection 
                ? (<NewSectionForm onClose={() => setOpenNewSection(false)}/>)
                : (<button onClick={() => setOpenNewSection(true)} className="btn w-[230px] btn-dash btn-primary"> New Section</button>)
            }
        </div>
    );
};

export default Board