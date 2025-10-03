// Hooks
import { useEffect, useMemo, useState } from "react"
import { useBoardStore } from "../store/useBoardStore"

// Components
import Card from "../components/Card"
import List from "../components/List"
import { Grid3x3, List as ListIcon, Plus } from "lucide-react"
import Modal from "../components/Modal"
import NewBoardForm from "../components/forms/NewBoardForm"
import { useBoard } from "../hooks/useBoard"
import { useParams } from "react-router-dom"

// Types
type TabState = 'recent' | 'personal' | 'shared'


const BoardPage = () => {
    const param = useParams();
    const { filteredBoards, setFilterBoard } = useBoardStore();
    const { isBoardLoading } = useBoard(param.id as string);
    const [tab, setTab] = useState<TabState>('recent');
    const [isCard, setIsCard] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    useEffect(() => {
        setFilterBoard(tab)
    }, [tab]);

    const boardCards = useMemo(() => filteredBoards?.map(board => <Card key={board._id} board={board} />),
        [filteredBoards]
    );

    const boardLists = useMemo(() => filteredBoards?.map(board => <List key={board._id} board={board} />),
        [filteredBoards]
    );

    return (
        <div className="h-full flex flex-col gap-2">
            <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(s => !s)}> 
                <NewBoardForm />
            </Modal>
            <ul className="flex gap-2 items-center text-xs shrink-0">
                <li onClick={() => setTab('recent')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'recent' &&  'bg-base-300 font-medium border-1 border-neutral-content/10'}`} >Recent</li>
                <li onClick={() => setTab('personal')} className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'personal' &&  'bg-base-300 font-medium'}`} >Personal</li>
                <li onClick={() => setTab('shared')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'shared' &&  'bg-base-300 font-medium'}`} >Shared with me</li>
                <p className="text-2xl text-base-content/10"> | </p>
                <li className="ml-auto md:ml-2">
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-primary btn-dash rounded-xs p-2 md:w-[120px] text-base-content hover:text-neutral-content"><Plus size={15}/><span className="hidden md:block">Create</span></button>
                </li>
                <li onClick={() => setIsCard(s => !s)} className={`md:ml-auto p-2 bg-neutral/80 border-1 border-neutral-content/10 rounded-xs text-neutral-content cursor-pointer hover:bg-neutral active:bg-neutral/80`}>
                    {isCard ? (<Grid3x3 size={15}/>) : (<ListIcon size={15}/>)}
                </li>
            </ul>
            {!isBoardLoading && (
                filteredBoards && filteredBoards?.length < 1 
                ? (<h1 className="self-center my-auto text-base-content/50 text-3xl">No boards</h1>)
                : ( <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 overflow-y-auto ${!isCard && '!grid-cols-1'}`}>
                        {isCard ? boardCards : boardLists}
                    </div>
                )
            )}
            
        </div>
    );
};

export default BoardPage