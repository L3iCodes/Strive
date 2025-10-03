import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import type { BoardSummary } from "../types";

interface BoardProps{
    boards: BoardSummary[];
    filteredBoards: BoardSummary[];
    setBoards: (boards: BoardSummary[]) => void;
    setFilterBoard: (tab: 'recent' | 'personal' | 'shared') => void; 
};

export const useBoardStore = create<BoardProps>((set, get) => ({
    boards: [],
    filteredBoards: [],

    setBoards: (boards) => {
        set({boards})
        set({filteredBoards: boards})
    },

    setFilterBoard: (tab) => {
        const { user } = useAuthStore.getState(); // use getState() instead of hook
        let filtered: BoardSummary[] = [];

        switch(tab) {
            case 'recent':
                filtered = [...get().boards].sort((a,b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime());
                break;
            case 'personal':
                filtered = get().boards.filter(board => board.owner === user?._id);
                break;
            case 'shared':
                filtered = get().boards.filter(board => board.owner !== user?._id);
                break;
            default:
                filtered = get().boards;
        }

        set({ filteredBoards: filtered });
    },
}));