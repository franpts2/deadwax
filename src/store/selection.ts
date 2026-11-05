import { create } from "zustand"

type SelectionState = {
	hoveredId: string | null
	selectedId: string | null
	hover: (id: string | null) => void
	select: (id: string | null) => void
}

export const useSelection = create<SelectionState>((set, get) => ({
	hoveredId: null,
	selectedId: null,
	hover: (id) => {
		if (get().hoveredId !== id) set({ hoveredId: id })
	},
	select: (id) => set({ selectedId: id, hoveredId: null }),
}))
