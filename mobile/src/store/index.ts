// =============================
// FILE: mobile/src/store/index.ts
// =============================
import { create } from 'zustand';

type MediaItem = {
  _id: string;
  key: string;
  type: 'image' | 'video';
  status: 'pending' | 'processing' | 'done' | 'failed';
  meta?: any;
};

type State = {
  items: MediaItem[];
  add: (m: MediaItem) => void;
  update: (id: string, patch: Partial<MediaItem>) => void;
  clear: () => void;
};

export const useMediaStore = create<State>((set) => ({
  items: [],
  add: (m) => set((s) => ({ items: [m, ...s.items] })),
  update: (id, patch) =>
    set((s) => ({ items: s.items.map((x) => (x._id === id ? { ...x, ...patch } : x)) })),
  clear: () => set({ items: [] }),
}));

