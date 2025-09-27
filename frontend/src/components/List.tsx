import type { Board } from "../store/useBoardStore";

interface ListProps {
  board: Board;
}

const List = ({board}: ListProps) => {
    return (
        <div className="w-full h-fit p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 border-[1.5px] border-base-content/10 rounded-xs cursor-pointer hover:bg-base-300/30 active:bg-base-300">
            <div className="flex flex-col leading-0 flex-1">
                <h1 className="text-xs font-medium">{board.title}</h1>
                <p className="text-[10px] mt-2 text-base-content/40">Last Modified {board.lastOpened as string}</p>
            </div>
            <div className="flex flex-col flex-1">
                <p className="text-xs font-medium">Progress (1/3)</p>
                <progress className="progress w-full" value="2" max="3"></progress>
            </div>
        </div>
    );
};

export default List
