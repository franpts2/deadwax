import { useThree, type ThreeEvent } from "@react-three/fiber"
import { RECORD_Y } from "../../constants/shelf"
import { SLEEVE, SPINE_Z } from "../../constants/sleeve"
import { recordAtX, type PlacedRecord } from "../../data/layout"
import { setCursor } from "../../lib/cursor"
import { isClick } from "../../lib/pointer"

type Props = {
	records: PlacedRecord[]
	span: number
	onHover: (id: string | null) => void
	onSelect: (id: string) => void
}

/**
 * Sits exactly at the spine plane so x is not skewed by perspective, and snaps
 * the pointer to the nearest spine instead of raycasting 152 thin hitboxes.
 */
export function SpineHitPlane({ records, span, onHover, onSelect }: Props) {
	const gl = useThree((state) => state.gl)

	const handleMove = (event: ThreeEvent<PointerEvent>) => {
		const record = recordAtX(records, event.point.x)
		onHover(record?.id ?? null)
		setCursor(gl.domElement, record ? "pointer" : "grab")
	}

	const handleClick = (event: ThreeEvent<MouseEvent>) => {
		// A drag should never pull a record out.
		if (!isClick(event.delta)) return
		const record = recordAtX(records, event.point.x)
		if (record) onSelect(record.id)
	}

	return (
		<mesh
			position={[0, RECORD_Y, SPINE_Z]}
			onPointerMove={handleMove}
			onPointerLeave={() => onHover(null)}
			onClick={handleClick}
		>
			<planeGeometry args={[span + 0.04, SLEEVE]} />
			<meshBasicMaterial visible={false} />
		</mesh>
	)
}
