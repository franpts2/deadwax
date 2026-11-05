import * as THREE from "three"
import type { RecordItem } from "../../data/types"
import { useDisposable, useOptionalDisposable } from "../../hooks/useDisposable"
import { getCoverTexture } from "../../lib/textures/cover"
import { createSpineTexture } from "../../lib/textures/spine"

/**
 * Materials for one sleeve. The paper and spine always exist; covers are only
 * generated once the record is being pulled out, then disposed when it is home.
 */
export function useRecordMaterials(item: RecordItem, dressed: boolean) {
	const paper = useDisposable(
		() =>
			new THREE.MeshStandardMaterial({
				color: item.spinePaper,
				roughness: 0.9,
				metalness: 0,
			}),
		[item.spinePaper],
	)

	const spine = useDisposable(
		() =>
			new THREE.MeshPhysicalMaterial({
				map: createSpineTexture(item),
				roughness: 0.76,
				metalness: 0,
				sheen: 0.16,
				sheenRoughness: 0.9,
				sheenColor: new THREE.Color("#ffffff"),
			}),
		[item],
	)

	const front = useOptionalDisposable(
		() =>
			dressed
				? new THREE.MeshStandardMaterial({
						map: getCoverTexture(item, "front"),
						roughness: 0.55,
						metalness: 0,
					})
				: null,
		[dressed, item],
	)

	const back = useOptionalDisposable(
		() =>
			dressed
				? new THREE.MeshStandardMaterial({
						map: getCoverTexture(item, "back"),
						roughness: 0.85,
						metalness: 0,
					})
				: null,
		[dressed, item],
	)

	return { paper, spine, front, back }
}
