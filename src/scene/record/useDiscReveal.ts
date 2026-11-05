import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import {
	DISC_REVEAL_DAMP_IN,
	DISC_REVEAL_DAMP_OUT,
	DISC_REVEAL_LIFT,
	DISC_SPIN_SPEED,
} from "../../constants/animation"

/**
 * Slides the disc out of the sleeve and spins it in its own plane. Any
 * out-of-plane tilt makes the disc slice through the cover and z-fight.
 */
export function useDiscReveal(active: boolean) {
	const group = useRef<THREE.Group>(null)
	const reveal = useRef(0)

	useFrame((_, delta) => {
		const dt = Math.min(delta, 0.05)
		reveal.current = THREE.MathUtils.damp(
			reveal.current,
			active ? 1 : 0,
			active ? DISC_REVEAL_DAMP_IN : DISC_REVEAL_DAMP_OUT,
			dt,
		)

		const node = group.current
		if (!node) return

		node.position.y = reveal.current * DISC_REVEAL_LIFT
		if (active) node.rotation.x += dt * DISC_SPIN_SPEED
	})

	return group
}
