import { animated } from "@react-spring/three"
import { memo } from "react"
import type { PlacedRecord } from "../../data/layout"
import { useSelection } from "../../store/selection"
import { Disc } from "./Disc"
import { RecordCover } from "./RecordCover"
import { RecordSleeve } from "./RecordSleeve"
import { RecordSpine } from "./RecordSpine"
import { useRecordChoreography } from "./useRecordChoreography"
import { useRecordMaterials } from "./useRecordMaterials"
import { useRecordSprings } from "./useRecordSprings"

type Props = {
	item: PlacedRecord
	selected: boolean
	hovered: boolean
}

/**
 * One record: an animated group in shelf-local space, plus the four meshes
 * that make it a sleeve. All choreography lives in hooks so this stays a map
 * of state to geometry.
 */
export const Record = memo(function Record({ item, selected, hovered }: Props) {
	const select = useSelection((state) => state.select)
	const { group, phase, dressed } = useRecordChoreography(selected)
	const { position, rotation } = useRecordSprings({ item, phase, hovered })
	const materials = useRecordMaterials(item, dressed)

	return (
		<animated.group ref={group} name={item.id} position={position} rotation={rotation}>
			<RecordSleeve
				item={item}
				material={materials.paper}
				selected={selected}
				onDeselect={() => select(null)}
			/>
			<RecordSpine item={item} material={materials.spine} />

			{materials.front && <RecordCover item={item} side="front" material={materials.front} />}
			{materials.back && <RecordCover item={item} side="back" material={materials.back} />}

			{dressed && <Disc item={item} active={phase === "facing"} />}
		</animated.group>
	)
})
