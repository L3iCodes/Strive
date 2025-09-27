// Hooks
import { useEffect, useMemo, useState } from "react"
import { useBoardStore } from "../store/useBoardStore"

// Components
import Card from "../components/Card"
import List from "../components/List"
import { Grid3x3, List as ListIcon } from "lucide-react"

// Types
type TabState = 'recent' | 'personal' | 'shared'


const BoardPage = () => {
    const { filteredBoards, setFilterBoard } = useBoardStore();
    const [tab, setTab] = useState<TabState>('recent');
    const [isCard, setIsCard] = useState<boolean>(true);

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
            <ul className="flex gap-3 items-center text-xs shrink-0">
                <li onClick={() => setTab('recent')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'recent' &&  'bg-base-300'}`} >Recent</li>
                <li onClick={() => setTab('personal')} className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'personal' &&  'bg-base-300'}`} >Personal</li>
                <li onClick={() => setTab('shared')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'shared' &&  'bg-base-300'}`} >Shared with me</li>
                <li onClick={() => setIsCard(s => !s)} className="ml-2 p-2 bg-primary/50 rounded-xs text-primary-content cursor-pointer hover:bg-primary active:bg-primary/50">
                    {isCard ? (<Grid3x3 size={15}/>) : (<ListIcon size={15}/>)}
                </li>
                
            </ul>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 overflow-y-auto ${!isCard && '!grid-cols-1'}`}>
                {isCard ? boardCards : boardLists}

            </div>
        </div>
    );
};

export default BoardPage