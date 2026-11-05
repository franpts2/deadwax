import { useSpring } from "@react-spring/three"
import { FOCUS_Z } from "../../constants/camera"
import { HOVER_NUDGE } from "../../constants/interaction"
import { RECORD_Y } from "../../constants/shelf"
import type { PlacedRecord } from "../../data/layout"
import type { Phase } from "./useRecordChoreography"

type Vec3 = [number, number, number]

type Options = {
	item: PlacedRecord
	phase: Phase
	hovered: boolean
}

/** Positions the sleeve in the row, out in front of it, or turned to face you. */
export function useRecordSprings({ item, phase, hovered }: Options) {
	const spring = useSpring({
		position:
			phase === "shelf"
				? [item.x, RECORD_Y, item.depth + (hovered ? HOVER_NUDGE : 0)]
				: [item.x, RECORD_Y, FOCUS_Z],
		rotation: phase === "facing" ? [0.018, Math.PI / 2 - 0.08, 0.02] : [0, 0, item.lean],
		config: (key: string) => {
			if (key === "rotation") {
				return phase === "facing"
					? { tension: 58, friction: 16 }
					: { tension: 140, friction: 24 }
			}
			return phase === "shelf"
				? { tension: 120, friction: 27 }
				: { tension: 92, friction: 22 }
		},
	})

	return {
		position: spring.position as unknown as Vec3,
		rotation: spring.rotation as unknown as Vec3,
	}
}
