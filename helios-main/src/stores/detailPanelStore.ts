import { create } from "zustand";

import type { CCTVData } from "../API/cctvAPI";

type DetailPanelState = {
  isOpen: boolean;
  selected: CCTVData | null;
  open: (data: CCTVData) => void;
  replace: (data: CCTVData) => void;
  close: () => void;
};

export const useDetailPanelStore = create<DetailPanelState>()((set) => ({
  isOpen: false,
  selected: null,
  open: (data) => set({ isOpen: true, selected: data }),
  replace: (data) => set((s) => ({ isOpen: true, selected: data })),
  close: () => set({ isOpen: false, selected: null }),
}));
