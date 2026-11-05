import { Html } from "@react-three/drei"
import { RECORD_Y } from "../../constants/shelf"
import { TOOLTIP_LIFT, TOOLTIP_Z } from "../../constants/interaction"
import type { PlacedRecord } from "../../data/layout"

/** HTML label pinned above the hovered spine. */
export function SpineTooltip({ record }: { record: PlacedRecord }) {
	return (
		<Html
			position={[record.x, RECORD_Y + TOOLTIP_LIFT, TOOLTIP_Z]}
			center
			zIndexRange={[12, 0]}
			style={{ pointerEvents: "none" }}
		>
			<div className="tooltip-in flex flex-col items-center">
				<div className="whitespace-nowrap rounded-md border border-white/10 bg-[#0b0a0c]/85 px-3.5 py-2.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)] backdrop-blur-md">
					<p className="text-[9px] uppercase tracking-[0.22em] text-ink-dim">{record.artist}</p>
					<p className="font-display text-[17px] leading-tight text-ink">{record.title}</p>
					<p className="mt-0.5 text-[9px] text-ink-faint">
						{record.year} · {record.label}
					</p>
				</div>
				<div className="h-3 w-px bg-gradient-to-b from-white/25 to-transparent" />
			</div>
		</Html>
	)
}
