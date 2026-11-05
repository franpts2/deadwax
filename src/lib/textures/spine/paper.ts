import { SPINE_MM } from "./shared"

/** Base paper, aged tone drift and vertical streaks. */
export function drawSpinePaper(
	ctx: CanvasRenderingContext2D,
	widthMM: number,
	paper: string,
	rand: () => number,
): void {
	ctx.fillStyle = paper
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
}

/** Folds, top edge highlight and bottom ambient occlusion. Drawn over the text. */
export function drawSpineLighting(ctx: CanvasRenderingContext2D, widthMM: number): void {
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
}
