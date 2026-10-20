import type * as THREE from "three"
import type { RecordItem } from "../../../data/types"
import { createTextureCache } from "../createTextureCache"
import { createGrooveNormalMap } from "./grooves"
import { createDiscFaceTexture } from "./face"

let grooveMap: THREE.Texture | null = null

/** One groove map is shared by every disc; it never varies per record. */
export function getGrooveNormalMap(): THREE.Texture {
	if (!grooveMap) grooveMap = createGrooveNormalMap()
	return grooveMap
}

const faceCache = createTextureCache(32)

export function getDiscFaceTexture(item: RecordItem): THREE.Texture {
	return faceCache.get(item.id, () => createDiscFaceTexture(item))
}
