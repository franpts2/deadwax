import * as THREE from "three"
import { mulberry32 } from "../random"
import { canvasTexture, createCanvas } from "./surface"

const W = 1024
const H = 256

/** Walnut boards. One canvas used as both colour and bump map. */
export function createWoodTextures(): { map: THREE.Texture; bump: THREE.Texture } {
	const { canvas, ctx } = createCanvas(W, H)
	const rand = mulberry32(0x51f3a7)

	ctx.fillStyle = "#43301f"
	ctx.fillRect(0, 0, W, H)

	const base = ctx.createLinearGradient(0, 0, 0, H)
	base.addColorStop(0, "rgba(255,220,180,0.10)")
	base.addColorStop(0.45, "rgba(0,0,0,0.02)")
	base.addColorStop(1, "rgba(0,0,0,0.28)")
	ctx.fillStyle = base
	ctx.fillRect(0, 0, W, H)

	// Long grain, gently wavering.
	for (let i = 0; i < 260; i++) {
		const y = rand() * H
		const amplitude = 0.6 + rand() * 3.2
		const frequency = 0.004 + rand() * 0.012
		const phase = rand() * Math.PI * 2
		const light = rand() > 0.52
		ctx.strokeStyle = light
			? `rgba(255,214,170,${0.012 + rand() * 0.05})`
			: `rgba(12,7,4,${0.02 + rand() * 0.08})`
		ctx.lineWidth = 0.6 + rand() * 1.8
		ctx.beginPath()
		for (let x = 0; x <= W; x += 8) {
			const yy = y + Math.sin(x * frequency + phase) * amplitude
			if (x === 0) ctx.moveTo(x, yy)
			else ctx.lineTo(x, yy)
		}
		ctx.stroke()
	}

	// Knots.
	for (let i = 0; i < 3; i++) {
		const cx = 90 + rand() * (W - 180)
		const cy = 40 + rand() * (H - 80)
		for (let ring = 0; ring < 6; ring++) {
			ctx.strokeStyle = `rgba(10,6,3,${0.05 + ring * 0.012})`
			ctx.lineWidth = 1.1
			ctx.beginPath()
			ctx.ellipse(cx, cy, 6 + ring * 5, 3 + ring * 2.4, rand() * 0.6, 0, Math.PI * 2)
			ctx.stroke()
		}
	}

	const map = canvasTexture(canvas)
	map.wrapS = THREE.RepeatWrapping
	map.wrapT = THREE.RepeatWrapping
	map.repeat.set(1.7, 1)
	map.anisotropy = 8

	const bump = canvasTexture(canvas, { srgb: false })
	bump.wrapS = THREE.RepeatWrapping
	bump.wrapT = THREE.RepeatWrapping
	bump.repeat.copy(map.repeat)

	return { map, bump }
}
