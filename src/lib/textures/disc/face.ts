import type * as THREE from "three"
import type { RecordItem } from "../../../data/types"
import { seeded } from "../../random"
import { SANS, SERIF } from "../fonts"
import { addGrain, canvasTexture, createCanvas } from "../surface"
import { DISC_PX, LABEL_RATIO } from "./shared"

/** The face of the disc: vinyl colour outside, printed label inside. */
export function createDiscFaceTexture(item: RecordItem): THREE.Texture {
	const { canvas, ctx } = createCanvas(DISC_PX, DISC_PX)
	const rand = seeded(item.id, "disc")
	const center = DISC_PX / 2
	const radius = DISC_PX / 2
	const labelRadius = radius * LABEL_RATIO
	const [, accent, paper] = item.palette

	// Vinyl.
	ctx.fillStyle = item.disc
	ctx.fillRect(0, 0, DISC_PX, DISC_PX)

	const sheen = ctx.createRadialGradient(center * 0.86, center * 0.82, 4, center, center, radius)
	sheen.addColorStop(0, "rgba(255,255,255,0.10)")
	sheen.addColorStop(0.55, "rgba(255,255,255,0.02)")
	sheen.addColorStop(1, "rgba(0,0,0,0.35)")
	ctx.fillStyle = sheen
	ctx.fillRect(0, 0, DISC_PX, DISC_PX)

	// Lead-out and edge rings.
	ctx.strokeStyle = "rgba(0,0,0,0.35)"
	ctx.lineWidth = 2
	ctx.beginPath()
	ctx.arc(center, center, radius - 3, 0, Math.PI * 2)
	ctx.stroke()

	// Label.
	ctx.fillStyle = accent
	ctx.beginPath()
	ctx.arc(center, center, labelRadius, 0, Math.PI * 2)
	ctx.fill()

	ctx.strokeStyle = "rgba(0,0,0,0.35)"
	ctx.lineWidth = 1.4
	ctx.beginPath()
	ctx.arc(center, center, labelRadius - 1.5, 0, Math.PI * 2)
	ctx.stroke()

	const ink = paper
	ctx.fillStyle = ink
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"

	ctx.font = `600 8px ${SANS}`
	ctx.letterSpacing = "0.6px"
	ctx.fillText(item.artist.toUpperCase().slice(0, 26), center, center - labelRadius * 0.42)

	ctx.font = `600 10px ${SERIF}`
	ctx.letterSpacing = "0px"
	ctx.globalAlpha = 0.95
	ctx.fillText(item.title.slice(0, 30), center, center - labelRadius * 0.16)

	ctx.globalAlpha = 0.7
	ctx.font = `500 6px ${SANS}`
	ctx.letterSpacing = "0.4px"
	ctx.fillText(item.label.toUpperCase(), center, center + labelRadius * 0.5)

	ctx.globalAlpha = 1

	// Spindle hole.
	ctx.fillStyle = "#07070a"
	ctx.beginPath()
	ctx.arc(center, center, 6.5, 0, Math.PI * 2)
	ctx.fill()

	// A couple of pressing marks.
	ctx.strokeStyle = "rgba(255,255,255,0.05)"
	ctx.lineWidth = 1
	for (let i = 0; i < 3; i++) {
		ctx.beginPath()
		ctx.arc(center, center, labelRadius * (1.2 + i * 0.22), 0, Math.PI * 2)
		ctx.stroke()
	}

	addGrain(ctx, DISC_PX, DISC_PX, 0.03, 900, rand)

	return canvasTexture(canvas)
}
