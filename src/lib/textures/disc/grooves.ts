import type * as THREE from "three"
import { canvasTexture, createCanvas } from "../surface"
import { DISC_PX, LABEL_RATIO } from "./shared"

/**
 * Concentric groove normal map. This is the material that sells the record:
 * anisotropic roughness plus these rings gives a specular sweep as the disc
 * turns, which is what a real record does under a light.
 */
export function createGrooveNormalMap(): THREE.Texture {
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
	return canvasTexture(canvas, { srgb: false, anisotropy: 16 })
}
