import type * as THREE from "three"

/**
 * A tiny LRU of generated textures. The cache owns the texture, so callers must
 * never dispose what `get` returns — that is how a visible record ends up with
 * a freed GPU texture.
 */
export function createTextureCache(limit: number) {
	const entries = new Map<string, THREE.Texture>()

	return {
		get(key: string, create: () => THREE.Texture): THREE.Texture {
			const hit = entries.get(key)
			if (hit) {
				entries.delete(key)
				entries.set(key, hit)
				return hit
			}

			const texture = create()
			entries.set(key, texture)
			if (entries.size > limit) {
				const oldest = entries.keys().next().value
				if (oldest) {
					entries.get(oldest)?.dispose()
					entries.delete(oldest)
				}
			}
			return texture
		},

		clear(): void {
			for (const texture of entries.values()) texture.dispose()
			entries.clear()
		},
	}
}
