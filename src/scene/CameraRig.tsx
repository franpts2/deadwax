import { useThree } from "@react-three/fiber"
import { useRef } from "react"
import { CAMERA_Z, HALF_FOV } from "../constants/camera"
import { SPINE_Z } from "../constants/sleeve"
import type { PlacedRecord, ShelfLayout } from "../data/layout"
import { useSelection } from "../store/selection"
import { view } from "../store/view"
import { useCameraFocus } from "./camera/useCameraFocus"
import { usePanControls } from "./camera/usePanControls"

export function CameraRig({ layout }: { layout: ShelfLayout }) {
	const camera = useThree((state) => state.camera)
	const gl = useThree((state) => state.gl)
	const size = useThree((state) => state.size)
	const selectedId = useSelection((state) => state.selectedId)

	const selected = selectedId ? (layout.byId.get(selectedId) ?? null) : null
	const focusRef = useRef<PlacedRecord | null>(null)
	focusRef.current = selected

	const aspect = size.width / Math.max(1, size.height)
	// Measure at the spine plane, not at the camera's own z, or the pan range
	// comes out far too small: the rows are ~160mm in front of the origin.
	const spineDistance = CAMERA_Z - SPINE_Z
	const visibleWidth = 2 * spineDistance * Math.tan(HALF_FOV) * aspect
	const maxPan = Math.max(0, layout.span / 2 - visibleWidth / 2 + 0.01)
	view.maxPan = maxPan

	usePanControls(gl, maxPan, focusRef)
	useCameraFocus(camera, selected, maxPan)

	return null
}
