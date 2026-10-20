import type * as THREE from "three"
import { canvasTexture, createCanvas } from "./surface"

/** The dark wall the shelf hangs on, rendered so post-processing sees it. */
export function createBackdropTexture(): THREE.Texture {
	const { canvas, ctx } = createCanvas(512, 512)
	const gradient = ctx.createRadialGradient(256, 210, 20, 256, 260, 340)
	gradient.addColorStop(0, "#1d1714")
	gradient.addColorStop(0.42, "#120f10")
	gradient.addColorStop(0.75, "#0a0809")
	gradient.addColorStop(1, "#050405")
	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, 512, 512)
	return canvasTexture(canvas)
}
