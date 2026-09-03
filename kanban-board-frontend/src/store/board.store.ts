import { create } from "zustand";

interface BoardState {
  selectedBoardId: string | null;
  setSelectedBoard: (selectedBoardId: string | null) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  selectedBoardId: null,
  setSelectedBoard: (selectedBoardId) => set({ selectedBoardId }),
}));
