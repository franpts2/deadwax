import * as THREE from "three"
import type { RecordItem } from "../../data/records"
import { hashString, mulberry32 } from "../random"
import { addGrain, canvasTexture, createCanvas, fitText } from "./canvas"

const PX_PER_MM = 5
const SPINE_MM = 314
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', serif"

/**
 * Spine artwork. The canvas is measured in millimetres (the spine is 314mm tall
 * and 3-8mm wide) so type keeps real proportions instead of being stretched by
 * the extreme aspect ratio of the face.
 */
export function createSpineTexture(item: RecordItem): THREE.Texture {
	const widthMM = Math.max(3.1, item.thickness * 1000)
	const width = Math.round(widthMM * PX_PER_MM)
	const height = Math.round(SPINE_MM * PX_PER_MM)

	const { canvas, ctx } = createCanvas(width, height)
	ctx.scale(width / widthMM, height / SPINE_MM)

	const rand = mulberry32(hashString(`${item.id}-spine`))

	ctx.fillStyle = item.spinePaper
	ctx.fillRect(0, 0, widthMM, SPINE_MM)

	// Aged paper: broad tonal drift plus fine vertical streaks.
	const drift = ctx.createLinearGradient(0, 0, 0, SPINE_MM)
	drift.addColorStop(0, "rgba(255,255,255,0.05)")
	drift.addColorStop(0.5, "rgba(0,0,0,0.015)")
	drift.addColorStop(1, "rgba(0,0,0,0.05)")
	ctx.fillStyle = drift
	ctx.fillRect(0, 0, widthMM, SPINE_MM)

	for (let i = 0; i < 18; i++) {
		ctx.fillStyle = `rgba(0,0,0,${0.012 + rand() * 0.028})`
		ctx.fillRect(rand() * widthMM, 0, 0.08 + rand() * 0.45, SPINE_MM)
	}

	if (item.spineVariant !== "blank") {
		const flip = rand() < 0.08
		const startY = flip ? 14 : 300
		const regionStart = 26
		const regionEnd = 300
		const regionLength = regionEnd - regionStart
		const gap = 3.6

		ctx.save()
		ctx.translate(widthMM / 2, startY)
		ctx.rotate(flip ? Math.PI / 2 : -Math.PI / 2)
		ctx.textBaseline = "middle"
		ctx.textAlign = "left"

		const ink = item.spineInk
		const labelSize = Math.min(2, widthMM * 0.4)
		const artistSize = Math.min(2.9, widthMM * 0.56)
		const titleSize = Math.min(3.5, widthMM * 0.68)

		// Small printed mark at the foot of the spine.
		ctx.fillStyle = ink
		ctx.globalAlpha = 0.5
		ctx.font = `600 ${labelSize}px ${SANS}`
		ctx.letterSpacing = "0.2px"
		ctx.fillText(fitText(ctx, item.label.toUpperCase(), 24), 0, 0)

		if (item.spineVariant === "label-only") {
			// A printed device instead of the title, centred on the spine.
			ctx.globalAlpha = 0.75
			ctx.strokeStyle = ink
			ctx.lineWidth = 0.22
			ctx.beginPath()
			ctx.arc(regionStart + regionLength / 2, 0, Math.min(2.1, widthMM * 0.38), 0, Math.PI * 2)
			ctx.stroke()
			ctx.beginPath()
			ctx.arc(regionStart + regionLength / 2, 0, 0.7, 0, Math.PI * 2)
			ctx.fill()
		} else {
			// Artist and title as one centred line, the way most sleeves are printed.
			ctx.font = `600 ${artistSize}px ${SANS}`
			ctx.letterSpacing = "0.1px"
			const artist = fitText(ctx, item.artist.toUpperCase(), regionLength * 0.58)
			const artistWidth = ctx.measureText(artist).width

			const serif = rand() < 0.26
			ctx.font = serif
				? `600 ${titleSize}px ${SERIF}`
				: `600 ${titleSize}px ${SANS}`
			ctx.letterSpacing = "0px"
			const title = fitText(ctx, item.title, regionLength - artistWidth - gap)
			const titleWidth = ctx.measureText(title).width

			const start = regionStart + (regionLength - artistWidth - gap - titleWidth) / 2

			ctx.globalAlpha = 0.85
			ctx.font = `600 ${artistSize}px ${SANS}`
			ctx.fillText(artist, start, 0)

			ctx.globalAlpha = 1
			ctx.font = serif
				? `600 ${titleSize}px ${SERIF}`
				: `600 ${titleSize}px ${SANS}`
			ctx.fillText(title, start + artistWidth + gap, 0)
		}

		ctx.restore()
	}

	// Creases where the spine folds into the covers.
	const fold = ctx.createLinearGradient(0, 0, widthMM, 0)
	fold.addColorStop(0, "rgba(0,0,0,0.45)")
	fold.addColorStop(0.16, "rgba(0,0,0,0)")
	fold.addColorStop(0.84, "rgba(0,0,0,0)")
	fold.addColorStop(1, "rgba(0,0,0,0.45)")
	ctx.fillStyle = fold
	ctx.fillRect(0, 0, widthMM, SPINE_MM)

	// Top edge catches the room light; the bottom sits in shadow.
	ctx.fillStyle = "rgba(255,255,255,0.13)"
	ctx.fillRect(0, 0, widthMM, 0.5)
	const ao = ctx.createLinearGradient(0, SPINE_MM - 26, 0, SPINE_MM)
	ao.addColorStop(0, "rgba(0,0,0,0)")
	ao.addColorStop(1, "rgba(0,0,0,0.42)")
	ctx.fillStyle = ao
	ctx.fillRect(0, SPINE_MM - 26, widthMM, 26)

	addGrain(ctx, widthMM, SPINE_MM, 0.028, 320, rand)

	return canvasTexture(canvas)
}
