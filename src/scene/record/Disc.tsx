import * as THREE from "three"
import type { RecordItem } from "../../data/types"
import { useDisposable } from "../../hooks/useDisposable"
import { getDiscFaceTexture, getGrooveNormalMap } from "../../lib/textures/disc"
import { DISC_GEOMETRY, DISC_MATERIAL_GROUP } from "../geometry"
import { useDiscReveal } from "./useDiscReveal"

type MaterialSet = {
	list: THREE.Material[]
	dispose: () => void
}

function createMaterials(item: RecordItem): MaterialSet {
	const edge = new THREE.MeshPhysicalMaterial({
		color: item.disc,
		roughness: 0.3,
		metalness: 0.02,
		clearcoat: 0.5,
		clearcoatRoughness: 0.35,
	})
	const label = new THREE.MeshPhysicalMaterial({
		map: getDiscFaceTexture(item),
		normalMap: getGrooveNormalMap(),
		normalScale: new THREE.Vector2(0.6, 0.6),
		roughness: 0.24,
		metalness: 0.04,
		anisotropy: 0.85,
		clearcoat: 0.55,
		clearcoatRoughness: 0.22,
	})
	const back = new THREE.MeshPhysicalMaterial({
		color: item.disc,
		roughness: 0.3,
		metalness: 0.02,
		clearcoat: 0.5,
		clearcoatRoughness: 0.35,
	})

	const list: THREE.Material[] = []
	list[DISC_MATERIAL_GROUP.EDGE] = edge
	list[DISC_MATERIAL_GROUP.FACE] = label
	list[DISC_MATERIAL_GROUP.BACK] = back

	return { list, dispose: () => list.forEach((material) => material.dispose()) }
}

export function Disc({ item, active }: { item: RecordItem; active: boolean }) {
	const group = useDiscReveal(active)
	const materials = useDisposable(() => createMaterials(item), [item])

	return (
		<group ref={group}>
			<mesh geometry={DISC_GEOMETRY} material={materials.list} />
		</group>
	)
}
