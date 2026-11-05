import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import type * as THREE from "three"
import { EDGE_ON_EPSILON, RETURN_DRESS_MS, TURN_CLEARANCE } from "../../constants/animation"
import { FOCUS_Z } from "../../constants/camera"

export type Phase = "shelf" | "out" | "facing"

/**
 * Leaving and entering the row is a two-step move, and the second step waits
 * for the first to actually finish rather than for a fixed delay, so a slow
 * frame rate can never turn the sleeve through its neighbours.
 */
export function useRecordChoreography(selected: boolean) {
	const group = useRef<THREE.Group>(null)
	const [phase, setPhase] = useState<Phase>("shelf")
	const first = useRef(true)
	const [dressed, setDressed] = useState(false)

	useEffect(() => {
		if (first.current) {
			first.current = false
			if (!selected) return
		}
		setPhase("out")
	}, [selected])

	useFrame(() => {
		const node = group.current
		if (!node || phase !== "out") return

		if (selected) {
			// Clear of the row: a 90° turn sweeps 157mm, so the sleeve must sit in
			// front of the neighbouring spines before it starts to turn.
			if (node.position.z > FOCUS_Z - TURN_CLEARANCE) setPhase("facing")
		} else if (Math.abs(node.rotation.y) < EDGE_ON_EPSILON) {
			// Edge-on again, safe to slide home.
			setPhase("shelf")
		}
	})

	// Keep the artwork and disc mounted while the record slides home, otherwise
	// they pop out of existence mid-animation.
	useEffect(() => {
		if (selected) {
			setDressed(true)
			return
		}
		const timeout = window.setTimeout(() => setDressed(false), RETURN_DRESS_MS)
		return () => window.clearTimeout(timeout)
	}, [selected])

	return { group, phase, dressed }
}
