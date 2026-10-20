import { create } from "zustand"

type ShelfState = {
	hoveredId: string | null
	selectedId: string | null
	hover: (id: string | null) => void
	select: (id: string | null) => void
}

export const useShelf = create<ShelfState>((set, get) => ({
	hoveredId: null,
	selectedId: null,
	hover: (id) => {
		if (get().hoveredId !== id) set({ hoveredId: id })
	},
	select: (id) => set({ selectedId: id, hoveredId: null }),
}))

/** Mutable camera state. Lives outside React so panning never re-renders the scene. */
export const view = {
	targetX: 0,
	maxPan: 0,
}
