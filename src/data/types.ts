export type SpineVariant = "text" | "label-only" | "blank"

/** Three-colour cover palette: base, accent, paper. */
export type Palette = [string, string, string]

export type RecordItem = {
	id: string
	artist: string
	title: string
	year: number
	label: string
	genre: string
	/** Vinyl colour. Black unless the pressing is coloured. */
	disc: string
	palette: Palette
	/** Cover composition variant, 0-4. */
	art: number
	/** Sleeve thickness in metres. */
	thickness: number
	/** Idle lean, radians. */
	lean: number
	/** Depth offset in metres: records never sit perfectly flush. */
	depth: number
	spinePaper: string
	spineInk: string
	spineVariant: SpineVariant
}
