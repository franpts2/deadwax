import type * as THREE from "three"
import { COVER_OFFSET, SLEEVE } from "../../constants/sleeve"
import type { PlacedRecord } from "../../data/layout"
import { UNIT_PLANE } from "../geometry"

const SIDE = {
	front: { sign: -1, rotation: -Math.PI / 2 },
	back: { sign: 1, rotation: Math.PI / 2 },
} as const

type Props = {
	item: PlacedRecord
	side: "front" | "back"
	material: THREE.Material
}

/** A cover face. Front and back differ only in which way they look. */
export function RecordCover({ item, side, material }: Props) {
	const { sign, rotation } = SIDE[side]

	return (
		<mesh
			geometry={UNIT_PLANE}
			material={material}
			scale={[SLEEVE, SLEEVE, 1]}
			position={[sign * (item.thickness / 2 + COVER_OFFSET), 0, 0]}
			rotation={[0, rotation, 0]}
		/>
	)
}
