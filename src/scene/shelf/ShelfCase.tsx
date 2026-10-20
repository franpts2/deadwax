import { BACK_Z, BOARD, DEPTH, SHELF_BASE_Y, SHELF_HEADROOM } from "../../constants/shelf"
import { SLEEVE } from "../../constants/sleeve"
import { useShelfMaterials } from "./useShelfMaterials"

const BOTTOM_Y = SHELF_BASE_Y - BOARD / 2
const TOP_Y = SHELF_BASE_Y + SLEEVE + SHELF_HEADROOM + BOARD / 2
const SIDE_HEIGHT = TOP_Y + BOARD / 2 - (SHELF_BASE_Y - BOARD)
const SIDE_Y = (TOP_Y + SHELF_BASE_Y) / 2

/** The wooden case: floor, ceiling, back and two ends. */
export function ShelfCase({ width }: { width: number }) {
	const { wood, back } = useShelfMaterials()

	return (
		<group>
			<mesh position={[0, BOTTOM_Y, 0]} material={wood} receiveShadow castShadow>
				<boxGeometry args={[width, BOARD, DEPTH]} />
			</mesh>
			<mesh position={[0, TOP_Y, 0]} material={wood} receiveShadow castShadow>
				<boxGeometry args={[width, BOARD, DEPTH]} />
			</mesh>
			<mesh position={[0, SIDE_Y, BACK_Z]} material={back} receiveShadow>
				<boxGeometry args={[width, SIDE_HEIGHT, 0.016]} />
			</mesh>
			<mesh position={[-(width / 2 + BOARD / 2), SIDE_Y, 0]} material={wood} castShadow receiveShadow>
				<boxGeometry args={[BOARD, SIDE_HEIGHT, DEPTH]} />
			</mesh>
			<mesh position={[width / 2 + BOARD / 2, SIDE_Y, 0]} material={wood} castShadow receiveShadow>
				<boxGeometry args={[BOARD, SIDE_HEIGHT, DEPTH]} />
			</mesh>
		</group>
	)
}
