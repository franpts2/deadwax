import type * as THREE from "three"
import type { RecordItem } from "../../../data/types"
import { seeded } from "../../random"
import { addGrain, canvasTexture, createSurface } from "../surface"
import { drawSpineLighting, drawSpinePaper } from "./paper"
import { PX_PER_MM, SPINE_MM } from "./shared"
import { drawSpineText } from "./text"

/**
 * Spine artwork. The canvas is measured in millimetres (the spine is 314mm tall
 * and 3-8mm wide) so type keeps real proportions instead of being stretched by
 * the extreme aspect ratio of the face.
 */
export function createSpineTexture(item: RecordItem): THREE.Texture {
	const widthMM = Math.max(3.1, item.thickness * 1000)
	const width = Math.round(widthMM * PX_PER_MM)
	const height = Math.round(SPINE_MM * PX_PER_MM)

	const { canvas, ctx } = createSurface(width, height, widthMM, SPINE_MM)
	const rand = seeded(item.id, "spine")

	drawSpinePaper(ctx, widthMM, item.spinePaper, rand)
	drawSpineText(ctx, item, widthMM, rand)
	drawSpineLighting(ctx, widthMM)
	addGrain(ctx, widthMM, SPINE_MM, 0.028, 320, rand)

	return canvasTexture(canvas)
}
