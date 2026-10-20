import { GAP } from "../lib/dimensions"
import type { RecordItem } from "./records"

export type PlacedRecord = RecordItem & { x: number }

export type ShelfLayout = {
	records: PlacedRecord[]
	/** Total width of the records, edge to edge. */
	span: number
	/** Width including the case that holds them. */
	width: number
}

/**
 * Places records left to right around x = 0. Each sleeve's thin axis is X, so a
 * record occupies `thickness` of horizontal space and `SLEEVE` of depth in Z.
 */
export function layoutRecords(items: RecordItem[]): ShelfLayout {
	const span = items.reduce((sum, item) => sum + item.thickness, 0) + GAP * (items.length - 1)
	let cursor = -span / 2

	const records = items.map((item) => {
		const x = cursor + item.thickness / 2
		cursor += item.thickness + GAP
		return { ...item, x }
	})

	return { records, span, width: span + 0.06 }
}

/** Nearest record to a world x inside the shelf, or null in the gaps/ends. */
export function recordAtX(records: PlacedRecord[], x: number): PlacedRecord | null {
	let closest: PlacedRecord | null = null
	let best = Infinity

	for (const record of records) {
		const distance = Math.abs(record.x - x)
		const reach = record.thickness / 2 + GAP / 2
		if (distance < reach && distance < best) {
			best = distance
			closest = record
		}
	}

	return closest
}
