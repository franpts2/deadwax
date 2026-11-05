import { useEffect, type RefObject } from "react"
import type * as THREE from "three"
import { DRAG_SENSITIVITY, WHEEL_SENSITIVITY } from "../../constants/interaction"
import type { PlacedRecord } from "../../data/layout"
import { setCursor } from "../../lib/cursor"
import { clamp } from "../../lib/math"
import { view } from "../../store/view"

/** Wheel and drag panning. Blocked while a record is pulled out. */
export function usePanControls(
	gl: THREE.WebGLRenderer,
	maxPan: number,
	focusRef: RefObject<PlacedRecord | null>,
): void {
	useEffect(() => {
		const element = gl.domElement
		let dragging = false
		let lastX = 0

		const onWheel = (event: WheelEvent) => {
			if (focusRef.current) return
			event.preventDefault()
			const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
			view.targetX = clamp(view.targetX + delta * WHEEL_SENSITIVITY, -maxPan, maxPan)
		}

		const onPointerDown = (event: PointerEvent) => {
			dragging = true
			lastX = event.clientX
			setCursor(element, "grabbing")
		}

		const onPointerMove = (event: PointerEvent) => {
			if (!dragging || focusRef.current) return
			const dx = event.clientX - lastX
			lastX = event.clientX
			view.targetX = clamp(view.targetX - dx * DRAG_SENSITIVITY, -maxPan, maxPan)
		}

		const onPointerUp = () => {
			dragging = false
			setCursor(element, "grab")
		}

		element.addEventListener("wheel", onWheel, { passive: false })
		element.addEventListener("pointerdown", onPointerDown)
		window.addEventListener("pointermove", onPointerMove)
		window.addEventListener("pointerup", onPointerUp)

		return () => {
			element.removeEventListener("wheel", onWheel)
			element.removeEventListener("pointerdown", onPointerDown)
			window.removeEventListener("pointermove", onPointerMove)
			window.removeEventListener("pointerup", onPointerUp)
		}
	}, [gl, maxPan, focusRef])
}
