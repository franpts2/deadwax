import type { ShelfLayout } from "../data/layout"
import { useSelection } from "../store/selection"
import { Record } from "./record/Record"
import { ShelfCase } from "./shelf/ShelfCase"
import { SpineHitPlane } from "./shelf/SpineHitPlane"
import { SpineTooltip } from "./shelf/SpineTooltip"

export function Shelf({ layout }: { layout: ShelfLayout }) {
	const hoveredId = useSelection((state) => state.hoveredId)
	const selectedId = useSelection((state) => state.selectedId)
	const hover = useSelection((state) => state.hover)
	const select = useSelection((state) => state.select)

	const hovered = hoveredId ? (layout.byId.get(hoveredId) ?? null) : null

	return (
		<group>
			<ShelfCase width={layout.width} />

			{layout.records.map((record) => (
				<Record
					key={record.id}
					item={record}
					selected={record.id === selectedId}
					hovered={record.id === hoveredId}
				/>
			))}

			{!selectedId && (
				<SpineHitPlane
					records={layout.records}
					span={layout.span}
					onHover={hover}
					onSelect={select}
				/>
			)}

			{hovered && !selectedId && <SpineTooltip record={hovered} />}
		</group>
	)
}
