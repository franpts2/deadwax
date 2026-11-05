import { useEffect } from "react"
import { KEY_PAN_STEP } from "../constants/interaction"
import { clamp } from "../lib/math"
import { useSelection } from "../store/selection"
import { view } from "../store/view"

/** Esc returns the record; arrow keys nudge the shelf along. */
export function useShelfKeyboard(): void {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				useSelection.getState().select(null)
				return
			}

			if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
				const direction = event.key === "ArrowLeft" ? -1 : 1
				event.preventDefault()
				view.targetX = clamp(view.targetX + direction * KEY_PAN_STEP, -view.maxPan, view.maxPan)
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])
}
