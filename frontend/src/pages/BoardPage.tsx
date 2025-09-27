// Hooks
import { useEffect, useMemo, useState } from "react"
import { useBoardStore } from "../store/useBoardStore"

// Components
import Card from "../components/Card"

// Types
type TabState = 'recent' | 'personal' | 'shared'


const BoardPage = () => {
    const { filteredBoards, setFilterBoard } = useBoardStore();
    const [tab, setTab] = useState<TabState>('recent');

    useEffect(() => {
        setFilterBoard(tab)
    }, [tab]);


    const boardCards = useMemo(() => filteredBoards?.map(board => <Card key={board._id} board={board} />),
        [filteredBoards]
    );

    return (
        <div className="h-full flex flex-col gap-2">
            <ul className="flex gap-3 text-xs">
                <li onClick={() => setTab('recent')}   className={`p-1 px-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'recent' &&  'bg-base-300'}`} >Recent</li>
                <li onClick={() => setTab('personal')} className={`p-1 px-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'personal' &&  'bg-base-300'}`} >Personal</li>
                <li onClick={() => setTab('shared')}   className={`p-1 px-2 rounded-xs hover:bg-base-300 cursor-pointer ${tab === 'shared' &&  'bg-base-300'}`} >Shared with me</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 py-2 gap-2">
                {boardCards}
            </div>
        </div>
    )
}

export default BoardPage