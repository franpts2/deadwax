/** Relative luminance of a hex colour, 0–1. */
export function luminance(hex: string): number {
	const value = hex.replace("#", "")
	const r = parseInt(value.slice(0, 2), 16) / 255
	const g = parseInt(value.slice(2, 4), 16) / 255
	const b = parseInt(value.slice(4, 6), 16) / 255
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
