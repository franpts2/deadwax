import * as THREE from "three"
import type { RecordItem } from "../../data/records"
import { hashString, luminance, mulberry32 } from "../random"
import { addGrain, canvasTexture, createCanvas } from "./canvas"

const SIZE = 1024
const S = 314 // design units, millimetres of sleeve
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif"

type Palette = [string, string, string]

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

function drawArt(ctx: CanvasRenderingContext2D, art: number, palette: Palette, rand: () => number) {
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

function drawFront(item: RecordItem, ctx: CanvasRenderingContext2D, rand: () => number) {
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

function drawBack(item: RecordItem, ctx: CanvasRenderingContext2D, rand: () => number) {
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

function addWear(ctx: CanvasRenderingContext2D, rand: () => number) {
	ctx.save()
	ctx.strokeStyle = "rgba(0,0,0,0.35)"
	ctx.lineWidth = 1.4
	ctx.strokeRect(1.2, 1.2, S - 2.4, S - 2.4)

	ctx.strokeStyle = "rgba(255,255,255,0.1)"
	ctx.lineWidth = 0.7
	ctx.strokeRect(2.4, 2.4, S - 4.8, S - 4.8)

	// Ring wear from the disc pressing against the sleeve.
	if (rand() < 0.5) {
		ctx.strokeStyle = "rgba(0,0,0,0.08)"
		ctx.lineWidth = 3 + rand() * 2
		ctx.beginPath()
		ctx.arc(S / 2, S / 2, S * 0.36, 0, Math.PI * 2)
		ctx.stroke()
	}

	// Scuffs along the edges.
	ctx.strokeStyle = "rgba(255,255,255,0.16)"
	ctx.lineWidth = 0.6
	for (let i = 0; i < 7; i++) {
		const edge = Math.floor(rand() * 4)
		const a = rand() * S
		const len = 4 + rand() * 26
		ctx.beginPath()
		if (edge === 0) {
			ctx.moveTo(a, 1)
			ctx.lineTo(a + len, 1)
		} else if (edge === 1) {
			ctx.moveTo(a, S - 1)
			ctx.lineTo(a + len, S - 1)
		} else if (edge === 2) {
			ctx.moveTo(1, a)
			ctx.lineTo(1, a + len)
		} else {
			ctx.moveTo(S - 1, a)
			ctx.lineTo(S - 1, a + len)
		}
		ctx.stroke()
	}
	ctx.restore()
}

export function createCoverTexture(item: RecordItem, side: "front" | "back"): THREE.Texture {
	const { canvas, ctx } = createCanvas(SIZE, SIZE)
	ctx.scale(SIZE / S, SIZE / S)
	const rand = mulberry32(hashString(`${item.id}-${side}`))

	if (side === "front") drawFront(item, ctx, rand)
	else drawBack(item, ctx, rand)

	addWear(ctx, rand)
	addGrain(ctx, S, S, 0.035, 1400, rand)

	return canvasTexture(canvas)
}

const cache = new Map<string, THREE.Texture>()
const CACHE_LIMIT = 24

/** Covers are only generated for records that get pulled out, and kept in a small LRU. */
export function getCoverTexture(item: RecordItem, side: "front" | "back"): THREE.Texture {
	const key = `${item.id}:${side}`
	const hit = cache.get(key)
	if (hit) {
		cache.delete(key)
		cache.set(key, hit)
		return hit
	}

	const texture = createCoverTexture(item, side)
	cache.set(key, texture)
	if (cache.size > CACHE_LIMIT) {
		const oldest = cache.keys().next().value
		if (oldest) {
			cache.get(oldest)?.dispose()
			cache.delete(oldest)
		}
	}
	return texture
}
