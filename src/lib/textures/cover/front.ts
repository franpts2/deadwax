import type { RecordItem } from "../../../data/types"
import { luminance } from "../../color"
import { SANS, SERIF } from "../fonts"
import { drawArt } from "./art"
import { S } from "./shared"

function wrap(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	maxLines: number,
): string[] {
	const words = text.split(" ")
	const lines: string[] = []
	let line = ""

	for (const word of words) {
		const next = line ? `${line} ${word}` : word
		if (ctx.measureText(next).width > maxWidth && line) {
			lines.push(line)
			line = word
		} else {
			line = next
		}
	}
	if (line) lines.push(line)

	if (lines.length > maxLines) {
		const kept = lines.slice(0, maxLines)
		const last = kept[maxLines - 1]!
		kept[maxLines - 1] = `${last}…`
		return kept
	}
	return lines
}

export function drawFront(
	item: RecordItem,
	ctx: CanvasRenderingContext2D,
	rand: () => number,
): void {
	drawArt(ctx, item.art, item.palette, rand)

	const base = item.palette[0]
	const ink = luminance(base) > 0.5 ? "#17130f" : "#f4eee2"

	// Scrim so type survives busy artwork, top and bottom.
	const topScrim = ctx.createLinearGradient(0, 0, 0, S * 0.3)
	topScrim.addColorStop(0, "rgba(0,0,0,0.5)")
	topScrim.addColorStop(1, "rgba(0,0,0,0)")
	ctx.fillStyle = topScrim
	ctx.fillRect(0, 0, S, S * 0.3)

	const scrim = ctx.createLinearGradient(0, S * 0.45, 0, S)
	scrim.addColorStop(0, "rgba(0,0,0,0)")
	scrim.addColorStop(1, "rgba(0,0,0,0.55)")
	ctx.fillStyle = scrim
	ctx.fillRect(0, S * 0.45, S, S * 0.55)

	ctx.textAlign = "left"
	ctx.textBaseline = "alphabetic"

	// Artist.
	ctx.fillStyle = ink
	ctx.globalAlpha = 0.9
	ctx.font = `600 7px ${SANS}`
	ctx.letterSpacing = "0.9px"
	ctx.fillText(item.artist.toUpperCase(), 24, 42)

	// Title, wrapped and set in a serif.
	ctx.globalAlpha = 1
	ctx.font = `400 27px ${SERIF}`
	ctx.letterSpacing = "0px"
	const lines = wrap(ctx, item.title, S - 48, 2)
	const lineHeight = 26
	const startY = S - 62 - (lines.length - 1) * lineHeight
	lines.forEach((line, index) => {
		ctx.fillText(line, 24, startY + index * lineHeight)
	})

	// Footer.
	ctx.globalAlpha = 0.72
	ctx.fillStyle = ink
	ctx.fillRect(24, S - 46, S - 48, 0.5)
	ctx.font = `500 6.2px ${SANS}`
	ctx.letterSpacing = "0.5px"
	ctx.fillText(`${item.label.toUpperCase()}  ·  ${item.year}`, 24, S - 30)
	ctx.globalAlpha = 0.55
	ctx.fillText(item.genre.toUpperCase(), S - 24 - ctx.measureText(item.genre.toUpperCase()).width, S - 30)
}
