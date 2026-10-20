import * as THREE from "three"
import { useDisposable } from "../../hooks/useDisposable"
import { createWoodTextures } from "../../lib/textures/wood"

/** Walnut for the case, plus the dark board behind the records. */
export function useShelfMaterials() {
	const wood = useDisposable(() => {
		const textures = createWoodTextures()
		return new THREE.MeshStandardMaterial({
			map: textures.map,
			bumpMap: textures.bump,
			bumpScale: 0.0018,
			roughness: 0.74,
			metalness: 0,
		})
	}, [])

	const back = useDisposable(
		() =>
			new THREE.MeshStandardMaterial({
				color: "#141210",
				roughness: 0.95,
				metalness: 0,
			}),
		[],
	)

	return { wood, back }
}
