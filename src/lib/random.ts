/** Deterministic randomness: the shelf must look identical on every reload. */
export function hashString(value: string): number {
	let hash = 2166136261
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i)
		hash = Math.imul(hash, 16777619)
	}
	return hash >>> 0
}

export function mulberry32(seed: number): () => number {
	let a = seed >>> 0
	return () => {
		a = (a + 0x6d2b79f5) >>> 0
		let t = a
		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

/**
 * A deterministic stream for one record and one purpose. The salt keeps the
 * spine, cover and disc generators from repeating the same sequence.
 */
export function seeded(value: string, salt?: string): () => number {
	return mulberry32(hashString(salt ? `${value}-${salt}` : value))
}
