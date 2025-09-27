import { create } from "zustand";
import { sampleUserData } from "./sampleData";
import { useAuthStore } from "./useAuthStore";

interface Collaborators{
    user: string;
    email?: string;
    role: 'viewer' | 'editor';
    pending: boolean;
};

interface CheckList{
    sub_task: string;
    done: boolean;
}

interface Activities{
    user: string;
    email?: string;
    message: string;
    createdAt: Date | string;
}

interface Tasks{
    task_name: string;
    done:boolean;
    checklist: CheckList[];
    activities: Activities[];
};

interface Sections{
    name: string;
    tasks: Tasks[];
};

export interface Board{
    _id: string;
    title: string;
    description: string;
    owner: string;
    collaborators: Collaborators[];
    sections: Sections[];
    lastOpened: Date | string;
    favorite?: boolean;
    pinned?: boolean;
}

interface BoardProps{
    boards: Board[];
    filteredBoards: Board[];
    setFilterBoard: (tab: 'recent' | 'personal' | 'shared') => void; 
};


export const useBoardStore = create<BoardProps>((set, get) => ({
    boards: sampleUserData.boards,
    filteredBoards: sampleUserData.boards,

    setFilterBoard: (tab) => {
        const { user } = useAuthStore.getState(); // use getState() instead of hook
        let filtered: Board[] = [];

        switch(tab) {
            case 'recent':
                filtered = [...get().boards].sort((a,b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
                break;
            case 'personal':
                filtered = get().boards.filter(board => board.owner === user._id);
                break;
            case 'shared':
                filtered = get().boards.filter(board => board.owner !== user._id);
                break;
            default:
                filtered = get().boards;
        }

        set({ filteredBoards: filtered });
    }
}));



