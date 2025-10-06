import { create } from "zustand";
import type { Task } from "../types";

interface BoardStore {
    taskId: string | null;
    isPreviewOpen: boolean;
    showPreview: (taskId: string ) => void;
    setPreview: (state: boolean ) => void;
    setTask: (task: string | null) => void;
    closePreview: () => void;
}

export const useTaskStore = create<BoardStore>((set) => ({
    taskId: null,
    isPreviewOpen: false,

    setTask: (taskId) => {
        set({taskId})
    },

    setPreview: (state) => {
        set({isPreviewOpen: state})
    },

    showPreview: (taskId) => {
        set({ taskId });
        set({ isPreviewOpen: true });
    },

    closePreview: () => {
        set({ taskId: null });
        set({ isPreviewOpen: false });
    }
}));    