import * as THREE from "three"

export function createCanvas(width: number, height: number) {
	const canvas = document.createElement("canvas")
	canvas.width = Math.max(1, Math.round(width))
	canvas.height = Math.max(1, Math.round(height))
	const ctx = canvas.getContext("2d")
	if (!ctx) throw new Error("Could not create a 2D canvas context")
	return { canvas, ctx }
}

export function canvasTexture(
	canvas: HTMLCanvasElement,
	options: { srgb?: boolean; anisotropy?: number } = {},
): THREE.Texture {
	const { srgb = true, anisotropy = 8 } = options
	const texture = new THREE.CanvasTexture(canvas)
	texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
	texture.anisotropy = anisotropy
	texture.minFilter = THREE.LinearMipmapLinearFilter
	texture.magFilter = THREE.LinearFilter
	texture.needsUpdate = true
	return texture
}

/** Fit text to a width, trimming with an ellipsis. */
export function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
	if (ctx.measureText(text).width <= maxWidth) return text

	let low = 1
	let high = text.length
	while (low < high) {
		const mid = Math.ceil((low + high) / 2)
		const candidate = `${text.slice(0, mid).trimEnd()}…`
		if (ctx.measureText(candidate).width <= maxWidth) low = mid
		else high = mid - 1
	}
	return `${text.slice(0, low).trimEnd()}…`
}

export function addGrain(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	amount: number,
	dots: number,
	rand: () => number,
) {
	ctx.save()
	for (let i = 0; i < dots; i++) {
		const x = rand() * width
		const y = rand() * height
		const size = 0.2 + rand() * 1.1
		ctx.fillStyle = rand() > 0.5 ? `rgba(255,255,255,${amount})` : `rgba(0,0,0,${amount})`
		ctx.fillRect(x, y, size, size)
	}
	ctx.restore()
}
