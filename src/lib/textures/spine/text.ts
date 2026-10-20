import type { RecordItem } from "../../../data/types"
import { SANS, SERIF_FALLBACK } from "../fonts"
import { fitText } from "../surface"

/** Artist, title and label printed along the spine. */
export function drawSpineText(
	ctx: CanvasRenderingContext2D,
	item: RecordItem,
	widthMM: number,
	rand: () => number,
): void {
	if (item.spineVariant === "blank") return

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
			? `600 ${titleSize}px ${SERIF_FALLBACK}`
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
			? `600 ${titleSize}px ${SERIF_FALLBACK}`
			: `600 ${titleSize}px ${SANS}`
		ctx.fillText(title, start + artistWidth + gap, 0)
	}

	ctx.restore()
}
