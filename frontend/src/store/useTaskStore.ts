import { create } from "zustand";
import type { Task } from "../types";

interface BoardStore {
    task: Task | null;
    isPreviewOpen: boolean;
    showPreview: (task: Task) => void;
    closePreview: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
    task: null,
    isPreviewOpen: false,

    showPreview: (task) => {
        set({ task });
        set({ isPreviewOpen: true });
    },

    closePreview: () => {
        set({ task: null });
        set({ isPreviewOpen: false });
    }
}));    