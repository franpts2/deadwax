import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
	CAMERA_BOB,
	CAMERA_DRIFT,
	CAMERA_Y,
	CAMERA_Z,
	FOCUS_CAMERA_Z,
	FOCUS_LOOK_Z,
	LOOK_Y,
} from "../../constants/camera"
import type { PlacedRecord } from "../../data/layout"
import { useReducedMotion } from "../../hooks/useReducedMotion"
import { clamp } from "../../lib/math"
import { view } from "../../store/view"

const DAMP_FOCUS = 4.6
const DAMP_BROWSE = 3.4
const DAMP_Y = 2.6
const DAMP_Z = 2.8

/** Damps the camera toward the pan target, or centers it on the pulled record. */
export function useCameraFocus(
	camera: THREE.Camera,
	focus: PlacedRecord | null,
	maxPan: number,
): void {
	const reduced = useReducedMotion()

	useFrame((state, delta) => {
		const dt = Math.min(delta, 0.05)
		const time = state.clock.elapsedTime

		const targetX = focus ? focus.x : clamp(view.targetX, -maxPan, maxPan)
		const drift = reduced ? 0 : Math.sin(time * 0.31) * CAMERA_DRIFT
		const bob = reduced ? 0 : Math.sin(time * 0.23) * CAMERA_BOB

		camera.position.x = THREE.MathUtils.damp(
			camera.position.x,
			targetX + drift,
			focus ? DAMP_FOCUS : DAMP_BROWSE,
			dt,
		)
		camera.position.y = THREE.MathUtils.damp(camera.position.y, CAMERA_Y + bob, DAMP_Y, dt)
		camera.position.z = THREE.MathUtils.damp(
			camera.position.z,
			focus ? FOCUS_CAMERA_Z : CAMERA_Z,
			DAMP_Z,
			dt,
		)

		camera.lookAt(camera.position.x, LOOK_Y, focus ? FOCUS_LOOK_Z : 0)
	})
}
