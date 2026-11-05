import type * as THREE from "three"
import type { RecordItem } from "../../../data/types"
import { seeded } from "../../random"
import { addGrain, canvasTexture, createSurface } from "../surface"
import { createTextureCache } from "../createTextureCache"
import { drawBack } from "./back"
import { drawFront } from "./front"
import { S, SIZE } from "./shared"
import { addWear } from "./wear"

export function createCoverTexture(item: RecordItem, side: "front" | "back"): THREE.Texture {
	const { canvas, ctx } = createSurface(SIZE, SIZE, S, S)
	const rand = seeded(item.id, side)

	if (side === "front") drawFront(item, ctx, rand)
	else drawBack(item, ctx, rand)

	addWear(ctx, rand)
	addGrain(ctx, S, S, 0.035, 1400, rand)

	return canvasTexture(canvas)
}

const cache = createTextureCache(24)

/** Covers are only generated for records that get pulled out, and kept in a small LRU. */
export function getCoverTexture(item: RecordItem, side: "front" | "back"): THREE.Texture {
	return cache.get(`${item.id}:${side}`, () => createCoverTexture(item, side))
}
