import { luminance } from "../lib/color"
import { seeded } from "../lib/random"
import { slugify } from "../lib/slug"
import { PALETTES, PAPER_COLOUR, PAPER_DARK, PAPER_LIGHT } from "./palettes"
import { RAW } from "./records.raw"
import type { RecordItem, SpineVariant } from "./types"

export const DEFAULT_DISC = "#0d0d10"

/** Fixture collection. Swap this derivation for a fetch when a backend lands. */
export const RECORDS: RecordItem[] = RAW.map((entry) => {
	const [artist, title, year, label, genre, disc] = entry
	const id = slugify(`${artist} ${title}`)
	const rand = seeded(id)

	const roll = rand()
	const papers = roll < 0.16 ? PAPER_DARK : roll < 0.28 ? PAPER_COLOUR : PAPER_LIGHT
	const spinePaper = papers[Math.floor(rand() * papers.length)]!
	const spineInk = luminance(spinePaper) > 0.45 ? "#201d1a" : "#f0e9dc"

	const gatefold = rand() < 0.07
	const thickness = gatefold ? 0.0061 + rand() * 0.0014 : 0.0033 + rand() * 0.0021

	const variantRoll = rand()
	const spineVariant: SpineVariant =
		variantRoll < 0.09 ? "blank" : variantRoll < 0.18 ? "label-only" : "text"

	return {
		id,
		artist,
		title,
		year,
		label,
		genre,
		disc: disc ?? DEFAULT_DISC,
		palette: PALETTES[Math.floor(rand() * PALETTES.length)]!,
		art: Math.floor(rand() * 5),
		thickness,
		lean: (rand() - 0.5) * 0.012,
		depth: (rand() - 0.5) * 0.003,
		spinePaper,
		spineInk,
		spineVariant,
	}
})

export const RECORDS_BY_ID = new Map(RECORDS.map((record) => [record.id, record]))

export function isBlackVinyl(record: RecordItem): boolean {
	return record.disc.toLowerCase() === DEFAULT_DISC
}
