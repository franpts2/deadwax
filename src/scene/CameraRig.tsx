import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { PlacedRecord, ShelfLayout } from "../data/layout"
import { CAMERA_Y, CAMERA_Z, FOCUS_CAMERA_Z, LOOK_Y, SPINE_Z } from "../lib/dimensions"
import { clamp } from "../lib/random"
import { useShelf, view } from "../store/shelf"

const HALF_FOV = THREE.MathUtils.degToRad(16) // fov 32

export function CameraRig({ layout }: { layout: ShelfLayout }) {
	const camera = useThree((state) => state.camera)
	const gl = useThree((state) => state.gl)
	const size = useThree((state) => state.size)
	const selectedId = useShelf((state) => state.selectedId)

	const selected = layout.records.find((record) => record.id === selectedId) ?? null
	const focusRef = useRef<PlacedRecord | null>(null)
	focusRef.current = selected

	const reduced = useMemo(
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		[],
	)

	const aspect = size.width / Math.max(1, size.height)
	// Measure at the spine plane, not at the camera's own z, or the pan range
	// comes out far too small: the rows are ~160mm in front of the origin.
	const spineDistance = CAMERA_Z - SPINE_Z
	const visibleWidth = 2 * spineDistance * Math.tan(HALF_FOV) * aspect
	const maxPan = Math.max(0, layout.span / 2 - visibleWidth / 2 + 0.01)
	view.maxPan = maxPan

	useEffect(() => {
		const element = gl.domElement
		let dragging = false
		let lastX = 0

		const onWheel = (event: WheelEvent) => {
			if (focusRef.current) return
			event.preventDefault()
			const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
			view.targetX = clamp(view.targetX + delta * 0.0011, -maxPan, maxPan)
		}

		const onPointerDown = (event: PointerEvent) => {
			dragging = true
			lastX = event.clientX
			element.style.cursor = "grabbing"
		}

		const onPointerMove = (event: PointerEvent) => {
			if (!dragging || focusRef.current) return
			const dx = event.clientX - lastX
			lastX = event.clientX
			view.targetX = clamp(view.targetX - dx * 0.00075, -maxPan, maxPan)
		}

		const onPointerUp = () => {
			dragging = false
			element.style.cursor = "grab"
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
	}, [gl, maxPan])

	useFrame((state, delta) => {
		const dt = Math.min(delta, 0.05)
		const time = state.clock.elapsedTime
		const focus = focusRef.current

		const targetX = focus ? focus.x : clamp(view.targetX, -maxPan, maxPan)
		const drift = reduced ? 0 : Math.sin(time * 0.31) * 0.0012
		const bob = reduced ? 0 : Math.sin(time * 0.23) * 0.0007

		camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX + drift, focus ? 4.6 : 3.4, dt)
		camera.position.y = THREE.MathUtils.damp(camera.position.y, CAMERA_Y + bob, 2.6, dt)
		camera.position.z = THREE.MathUtils.damp(
			camera.position.z,
			focus ? FOCUS_CAMERA_Z : CAMERA_Z,
			2.8,
			dt,
		)

		camera.lookAt(camera.position.x, LOOK_Y, focus ? 0.3 : 0)
	})

	return null
}
