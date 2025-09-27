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
                <li onClick={() => setTab('recent')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'recent' &&  'bg-base-300 font-medium'}`} >Recent</li>
                <li onClick={() => setTab('personal')} className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'personal' &&  'bg-base-300 font-medium'}`} >Personal</li>
                <li onClick={() => setTab('shared')}   className={`p-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'shared' &&  'bg-base-300 font-medium'}`} >Shared with me</li>
                <p className="text-2xl text-base-content/10"> | </p>
                <li onClick={() => setIsCard(s => !s)} className={`ml-auto xl:ml-2 p-2 bg-neutral/80 rounded-xs text-neutral-content cursor-pointer hover:bg-neutral active:bg-neutral/80`}>
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