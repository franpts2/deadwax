import type { RecordItem } from "../../../data/types"
import { luminance } from "../../color"
import { SANS, SERIF } from "../fonts"
import { S } from "./shared"

export function drawBack(
	item: RecordItem,
	ctx: CanvasRenderingContext2D,
	rand: () => number,
): void {
	const [base, accent, paper] = item.palette
	ctx.fillStyle = paper
	ctx.fillRect(0, 0, S, S)

	// Spine strip echoes the front.
	ctx.fillStyle = base
	ctx.fillRect(0, 0, S * 0.055, S)

	const ink = luminance(paper) > 0.5 ? "#1a1714" : "#f2ecdf"
	ctx.fillStyle = ink

	ctx.font = `600 7px ${SANS}`
	ctx.letterSpacing = "0.8px"
	ctx.globalAlpha = 0.8
	ctx.fillText(item.artist.toUpperCase(), 34, 44)

	ctx.globalAlpha = 1
	ctx.font = `400 20px ${SERIF}`
	ctx.letterSpacing = "0px"
	ctx.fillText(item.title, 34, 70)

	// Tracklist suggestion.
	ctx.globalAlpha = 0.24
	ctx.fillStyle = ink
	let y = 108
	for (let i = 0; i < 9; i++) {
		const w = 120 + rand() * 90
		ctx.fillRect(34, y, w, 2.2)
		y += 13
	}
	ctx.globalAlpha = 1

	// Barcode and label mark.
	ctx.fillStyle = ink
	ctx.globalAlpha = 0.7
	for (let i = 0; i < 26; i++) {
		const w = i % 3 === 0 ? 1.6 : 0.8
		ctx.fillRect(S - 92 + i * 3.2, S - 54, w, 24)
	}
	ctx.globalAlpha = 0.55
	ctx.font = `500 5.5px ${SANS}`
	ctx.letterSpacing = "0.4px"
	ctx.fillText(`${item.label.toUpperCase()}  ·  ${item.year}`, 34, S - 26)

	ctx.globalAlpha = 1
	ctx.fillStyle = accent
	ctx.beginPath()
	ctx.arc(S - 42, S - 92, 13, 0, Math.PI * 2)
	ctx.fill()
}
