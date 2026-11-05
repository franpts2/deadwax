import { S } from "./shared"

/** Edge scuffs, ring wear from the disc and a crease at the sleeve mouth. */
export function addWear(ctx: CanvasRenderingContext2D, rand: () => number): void {
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
