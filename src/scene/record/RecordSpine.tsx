import type * as THREE from "three"
import { HALF, SLEEVE, SPINE_HALF } from "../../constants/sleeve"
import type { PlacedRecord } from "../../data/layout"
import { UNIT_PLANE } from "../geometry"

type Props = {
	item: PlacedRecord
	material: THREE.Material
}

/** The printed spine, a hair's breadth off the body. */
export function RecordSpine({ item, material }: Props) {
	return (
		<mesh
			geometry={UNIT_PLANE}
			material={material}
			scale={[item.thickness, SLEEVE, 1]}
			position={[0, 0, HALF + SPINE_HALF]}
		/>
	)
}
