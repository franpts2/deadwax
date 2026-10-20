import { useSpring, animated } from "@react-spring/three"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import type { ThreeEvent } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { PlacedRecord } from "../data/layout"
import type { RecordItem } from "../data/records"
import {
	DISC_RADIUS,
	DISC_THICKNESS,
	FOCUS_Z,
	HALF,
	RECORD_Y,
	SLEEVE,
	SPINE_HALF,
} from "../lib/dimensions"
import { getCoverTexture } from "../lib/textures/cover"
import { getDiscFaceTexture, getGrooveNormalMap } from "../lib/textures/disc"
import { createSpineTexture } from "../lib/textures/spine"
import { useShelf } from "../store/shelf"

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)
const UNIT_PLANE = new THREE.PlaneGeometry(1, 1)

const DISC_GEOMETRY = (() => {
	const geometry = new THREE.CylinderGeometry(DISC_RADIUS, DISC_RADIUS, DISC_THICKNESS, 96, 1)
	// Axis along X so the label faces -X, the same way as the front cover.
	geometry.rotateZ(Math.PI / 2)
	return geometry
})()

type Props = {
	item: PlacedRecord
	selected: boolean
	hovered: boolean
}

type Phase = "shelf" | "out" | "facing"

export const RecordMesh = memo(function RecordMesh({ item, selected, hovered }: Props) {
	const select = useShelf((state) => state.select)
	const [phase, setPhase] = useState<Phase>("shelf")
	const group = useRef<THREE.Group>(null)
	const first = useRef(true)

	// Leaving/entering the row is a two-step move, but the second step waits for
	// the first to actually finish rather than for a fixed delay, so a slow frame
	// rate can never turn the sleeve through its neighbours.
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
			if (node.position.z > FOCUS_Z - 0.006) setPhase("facing")
		} else if (Math.abs(node.rotation.y) < 0.02) {
			// Edge-on again, safe to slide home.
			setPhase("shelf")
		}
	})

	// Keep the artwork and disc mounted while the record slides home, otherwise
	// they pop out of existence mid-animation.
	const [dressed, setDressed] = useState(false)

	useEffect(() => {
		if (selected) {
			setDressed(true)
			return
		}
		const timeout = window.setTimeout(() => setDressed(false), 1100)
		return () => window.clearTimeout(timeout)
	}, [selected])

	const spring = useSpring({
		position:
			phase === "shelf"
				? [item.x, RECORD_Y, item.depth + (hovered ? 0.0024 : 0)]
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

	const position = spring.position as unknown as [number, number, number]
	const rotation = spring.rotation as unknown as [number, number, number]

	const paper = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: item.spinePaper,
				roughness: 0.9,
				metalness: 0,
			}),
		[item.spinePaper],
	)

	const spine = useMemo(() => {
		const material = new THREE.MeshPhysicalMaterial({
			map: createSpineTexture(item),
			roughness: 0.76,
			metalness: 0,
			sheen: 0.16,
			sheenRoughness: 0.9,
			sheenColor: new THREE.Color("#ffffff"),
		})
		return material
	}, [item])

	const front = useMemo(
		() =>
			dressed
				? new THREE.MeshStandardMaterial({
						map: getCoverTexture(item, "front"),
						roughness: 0.55,
						metalness: 0,
					})
				: null,
		[dressed, item],
	)

	const back = useMemo(
		() =>
			dressed
				? new THREE.MeshStandardMaterial({
						map: getCoverTexture(item, "back"),
						roughness: 0.85,
						metalness: 0,
					})
				: null,
		[dressed, item],
	)

	return (
		<animated.group ref={group} name={item.id} position={position} rotation={rotation}>
			{/* Sleeve body. One draw call: the visible faces are the paper edges. */}
			<mesh
				geometry={UNIT_BOX}
				material={paper}
				scale={[item.thickness, SLEEVE, SLEEVE]}
				castShadow
				receiveShadow
				onClick={
					selected
						? (event: ThreeEvent<MouseEvent>) => {
								event.stopPropagation()
								if (event.delta < 6) select(null)
							}
						: undefined
				}
			/>

			{/* Printed spine, a hair's breadth off the body. */}
			<mesh
				geometry={UNIT_PLANE}
				material={spine}
				scale={[item.thickness, SLEEVE, 1]}
				position={[0, 0, HALF + SPINE_HALF]}
			/>

			{front && (
				<mesh
					geometry={UNIT_PLANE}
					material={front}
					scale={[SLEEVE, SLEEVE, 1]}
					position={[-item.thickness / 2 - 0.0003, 0, 0]}
					rotation={[0, -Math.PI / 2, 0]}
				/>
			)}

			{back && (
				<mesh
					geometry={UNIT_PLANE}
					material={back}
					scale={[SLEEVE, SLEEVE, 1]}
					position={[item.thickness / 2 + 0.0003, 0, 0]}
					rotation={[0, Math.PI / 2, 0]}
				/>
			)}

			{dressed && <Disc item={item} active={phase === "facing"} />}
		</animated.group>
	)
})

function Disc({ item, active }: { item: RecordItem; active: boolean }) {
	const group = useRef<THREE.Group>(null)
	const reveal = useRef(0)

	const face = useMemo(() => getDiscFaceTexture(item), [item])
	const grooves = useMemo(() => getGrooveNormalMap(), [])

	const materials = useMemo(() => {
		const edge = new THREE.MeshPhysicalMaterial({
			color: item.disc,
			roughness: 0.3,
			metalness: 0.02,
			clearcoat: 0.5,
			clearcoatRoughness: 0.35,
		})
		const label = new THREE.MeshPhysicalMaterial({
			map: face,
			normalMap: grooves,
			normalScale: new THREE.Vector2(0.6, 0.6),
			roughness: 0.24,
			metalness: 0.04,
			anisotropy: 0.85,
			clearcoat: 0.55,
			clearcoatRoughness: 0.22,
		})
		const back = new THREE.MeshPhysicalMaterial({
			color: item.disc,
			roughness: 0.3,
			metalness: 0.02,
			clearcoat: 0.5,
			clearcoatRoughness: 0.35,
		})
		return [edge, label, back]
	}, [face, grooves, item.disc])

	useFrame((_, delta) => {
		const dt = Math.min(delta, 0.05)
		reveal.current = THREE.MathUtils.damp(reveal.current, active ? 1 : 0, active ? 2.4 : 5, dt)

		const node = group.current
		if (!node) return

		node.position.y = reveal.current * 0.045
		// Spin only about the disc's own axis. Any out-of-plane tilt makes the
		// disc slice through the cover and z-fight across its face.
		if (active) node.rotation.x += dt * 0.42
	})

	return (
		<group ref={group}>
			<mesh geometry={DISC_GEOMETRY} material={materials} />
		</group>
	)
}
