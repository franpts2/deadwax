import type { ThreeEvent } from "@react-three/fiber"
import type * as THREE from "three"
import { SLEEVE } from "../../constants/sleeve"
import type { PlacedRecord } from "../../data/layout"
import { isClick } from "../../lib/pointer"
import { UNIT_BOX } from "../geometry"

type Props = {
	item: PlacedRecord
	material: THREE.Material
	selected: boolean
	onDeselect: () => void
}

/** The board itself. One draw call: the visible faces are the paper edges. */
export function RecordSleeve({ item, material, selected, onDeselect }: Props) {
	const handleClick = selected
		? (event: ThreeEvent<MouseEvent>) => {
				event.stopPropagation()
				if (isClick(event.delta)) onDeselect()
			}
		: undefined

	return (
		<mesh
			geometry={UNIT_BOX}
			material={material}
			scale={[item.thickness, SLEEVE, SLEEVE]}
			castShadow
			receiveShadow
			onClick={handleClick}
		/>
	)
}
