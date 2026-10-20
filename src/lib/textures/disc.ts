import * as THREE from "three"
import type { RecordItem } from "../../data/records"
import { hashString, mulberry32 } from "../random"
import { addGrain, canvasTexture, createCanvas } from "./canvas"

const DISC_PX = 512
const LABEL_RATIO = 0.05 / 0.15 // 10" label on a 12" disc

/**
 * Concentric groove normal map. This is the material that sells the record:
 * anisotropic roughness plus these rings gives a specular sweep as the disc
 * turns, which is what a real record does under a light.
 */
let grooveMap: THREE.Texture | null = null

export function getGrooveNormalMap(): THREE.Texture {
	if (grooveMap) return grooveMap

	const { canvas, ctx } = createCanvas(DISC_PX, DISC_PX)
	const image = ctx.createImageData(DISC_PX, DISC_PX)
	const data = image.data

	for (let y = 0; y < DISC_PX; y++) {
		for (let x = 0; x < DISC_PX; x++) {
			const nx = (x + 0.5) / DISC_PX - 0.5
			const ny = (y + 0.5) / DISC_PX - 0.5
			const r = Math.hypot(nx, ny)

			let rx = 0
			let ry = 0

			if (r < 0.5) {
				const outer = Math.min(1, Math.max(0, (0.497 - r) * 90))
				const inner = Math.min(1, Math.max(0, (r - LABEL_RATIO * 0.5 - 0.012) * 55))
				const amplitude = 0.62 * outer * inner
				const phase = (r / 0.5) * 150 * Math.PI * 2
				const slope = Math.cos(phase) * amplitude
				const ux = r > 1e-6 ? nx / r : 0
				const uy = r > 1e-6 ? ny / r : 0
				const length = Math.hypot(ux * slope, uy * slope, 1)
				rx = (ux * slope) / length
				ry = (uy * slope) / length
			}

			const index = (y * DISC_PX + x) * 4
			data[index] = (rx * 0.5 + 0.5) * 255
			data[index + 1] = (ry * 0.5 + 0.5) * 255
			data[index + 2] = (Math.sqrt(Math.max(0, 1 - rx * rx - ry * ry)) * 0.5 + 0.5) * 255
			data[index + 3] = 255
		}
	}

	ctx.putImageData(image, 0, 0)
	grooveMap = canvasTexture(canvas, { srgb: false, anisotropy: 16 })
	return grooveMap
}

/** The face of the disc: vinyl colour outside, printed label inside. */
export function createDiscFaceTexture(item: RecordItem): THREE.Texture {
	const { canvas, ctx } = createCanvas(DISC_PX, DISC_PX)
	const rand = mulberry32(hashString(`${item.id}-disc`))
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

	ctx.font = `600 8px 'Helvetica Neue', Arial, sans-serif`
	ctx.letterSpacing = "0.6px"
	ctx.fillText(item.artist.toUpperCase().slice(0, 26), center, center - labelRadius * 0.42)

	ctx.font = `600 10px 'Instrument Serif', Georgia, serif`
	ctx.letterSpacing = "0px"
	ctx.globalAlpha = 0.95
	ctx.fillText(item.title.slice(0, 30), center, center - labelRadius * 0.16)

	ctx.globalAlpha = 0.7
	ctx.font = `500 6px 'Helvetica Neue', Arial, sans-serif`
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

const discCache = new Map<string, THREE.Texture>()

export function getDiscFaceTexture(item: RecordItem): THREE.Texture {
	const hit = discCache.get(item.id)
	if (hit) return hit
	const texture = createDiscFaceTexture(item)
	discCache.set(item.id, texture)
	if (discCache.size > 32) {
		const oldest = discCache.keys().next().value
		if (oldest) {
			discCache.get(oldest)?.dispose()
			discCache.delete(oldest)
		}
	}
	return texture
}
