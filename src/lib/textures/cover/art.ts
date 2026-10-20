import type { Palette } from "../../../data/types"
import { S } from "./shared"

/** Five cover compositions, drawn from a curated palette. */
export function drawArt(
	ctx: CanvasRenderingContext2D,
	art: number,
	palette: Palette,
	rand: () => number,
): void {
	const [base, accent, paper] = palette
	ctx.fillStyle = base
	ctx.fillRect(0, 0, S, S)

	if (art === 0) {
		// A sun over a hard horizon.
		ctx.fillStyle = accent
		ctx.beginPath()
		ctx.arc(S / 2, S * 0.4, S * 0.26, 0, Math.PI * 2)
		ctx.fill()

		ctx.fillStyle = paper
		ctx.globalAlpha = 0.92
		ctx.fillRect(0, S * 0.66, S, S * 0.012)
		ctx.globalAlpha = 1
	} else if (art === 1) {
		// Cropped diagonal bands.
		ctx.save()
		ctx.translate(S / 2, S / 2)
		ctx.rotate(-0.42)
		ctx.fillStyle = accent
		ctx.fillRect(-S, -S * 0.42, S * 2, S * 0.2)
		ctx.globalAlpha = 0.85
		ctx.fillStyle = paper
		ctx.fillRect(-S, -S * 0.1, S * 2, S * 0.035)
		ctx.globalAlpha = 0.5
		ctx.fillStyle = accent
		ctx.fillRect(-S, S * 0.12, S * 2, S * 0.09)
		ctx.restore()
	} else if (art === 2) {
		// Halftone field.
		const step = S / 22
		for (let y = 0; y < 22; y++) {
			for (let x = 0; x < 22; x++) {
				const cx = (x + 0.5) * step
				const cy = (y + 0.5) * step
				const d = Math.hypot(cx - S * 0.45, cy - S * 0.38) / S
				const r = Math.max(0.6, step * 0.46 * (1 - d * 1.5) * (0.7 + rand() * 0.5))
				ctx.fillStyle = accent
				ctx.globalAlpha = 0.85
				ctx.beginPath()
				ctx.arc(cx, cy, r, 0, Math.PI * 2)
				ctx.fill()
			}
		}
		ctx.globalAlpha = 1
	} else if (art === 3) {
		// Severe and typographic.
		ctx.fillStyle = accent
		ctx.fillRect(S * 0.14, S * 0.16, S * 0.5, S * 0.004)
		ctx.fillRect(S * 0.14, S * 0.2, S * 0.3, S * 0.004)
		ctx.globalAlpha = 0.9
		ctx.fillStyle = paper
		ctx.beginPath()
		ctx.arc(S * 0.7, S * 0.48, S * 0.09, 0, Math.PI * 2)
		ctx.fill()
		ctx.globalAlpha = 1
	} else {
		// Stacked colour fields.
		ctx.fillStyle = accent
		ctx.fillRect(0, 0, S, S * 0.34)
		ctx.fillStyle = paper
		ctx.globalAlpha = 0.95
		ctx.fillRect(0, S * 0.34, S, S * 0.05)
		ctx.globalAlpha = 0.28
		ctx.fillStyle = accent
		ctx.fillRect(0, S * 0.39, S, S * 0.22)
		ctx.globalAlpha = 1
	}
}
