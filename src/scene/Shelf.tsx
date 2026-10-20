import { Html } from "@react-three/drei"
import { useThree, type ThreeEvent } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"
import { recordAtX, type PlacedRecord, type ShelfLayout } from "../data/layout"
import { RECORD_Y, SHELF_BASE_Y, SLEEVE } from "../lib/dimensions"
import { createWoodTextures } from "../lib/textures/wood"
import { useShelf } from "../store/shelf"
import { RecordMesh } from "./RecordMesh"

const BOARD = 0.028
const DEPTH = 0.4
const BACK_Z = -0.2

const bottomY = SHELF_BASE_Y - BOARD / 2
const topY = SHELF_BASE_Y + SLEEVE + 0.018 + BOARD / 2
const sideHeight = topY + BOARD / 2 - (SHELF_BASE_Y - BOARD)
const sideY = (topY + SHELF_BASE_Y) / 2

export function Shelf({ layout }: { layout: ShelfLayout }) {
	const hoveredId = useShelf((state) => state.hoveredId)
	const selectedId = useShelf((state) => state.selectedId)
	const hover = useShelf((state) => state.hover)
	const select = useShelf((state) => state.select)
	const gl = useThree((state) => state.gl)

	const wood = useMemo(() => {
		const textures = createWoodTextures()
		return new THREE.MeshStandardMaterial({
			map: textures.map,
			bumpMap: textures.bump,
			bumpScale: 0.0018,
			roughness: 0.74,
			metalness: 0,
		})
	}, [])

	const back = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: "#141210",
				roughness: 0.95,
				metalness: 0,
			}),
		[],
	)

	const hovered = hoveredId ? (layout.records.find((r) => r.id === hoveredId) ?? null) : null

	const handleMove = (event: ThreeEvent<PointerEvent>) => {
		const record = recordAtX(layout.records, event.point.x)
		hover(record?.id ?? null)
		gl.domElement.style.cursor = record ? "pointer" : "grab"
	}

	const handleClick = (event: ThreeEvent<MouseEvent>) => {
		// A drag should never pull a record out.
		if (event.delta > 6) return
		const record = recordAtX(layout.records, event.point.x)
		if (record) select(record.id)
	}

	return (
		<group>
			<mesh position={[0, bottomY, 0]} material={wood} receiveShadow castShadow>
				<boxGeometry args={[layout.width, BOARD, DEPTH]} />
			</mesh>
			<mesh position={[0, topY, 0]} material={wood} receiveShadow castShadow>
				<boxGeometry args={[layout.width, BOARD, DEPTH]} />
			</mesh>
			<mesh position={[0, sideY, BACK_Z]} material={back} receiveShadow>
				<boxGeometry args={[layout.width, sideHeight, 0.016]} />
			</mesh>
			<mesh position={[-(layout.width / 2 + BOARD / 2), sideY, 0]} material={wood} castShadow receiveShadow>
				<boxGeometry args={[BOARD, sideHeight, DEPTH]} />
			</mesh>
			<mesh position={[layout.width / 2 + BOARD / 2, sideY, 0]} material={wood} castShadow receiveShadow>
				<boxGeometry args={[BOARD, sideHeight, DEPTH]} />
			</mesh>

			{layout.records.map((record) => (
				<RecordMesh
					key={record.id}
					item={record}
					selected={record.id === selectedId}
					hovered={record.id === hoveredId}
				/>
			))}

			{/*
				Sits exactly at the spine plane so x is not skewed by perspective, and
				snaps to the nearest spine instead of raycasting 200 thin hitboxes.
			*/}
			{!selectedId && (
				<mesh
					position={[0, RECORD_Y, 0.165]}
					onPointerMove={handleMove}
					onPointerLeave={() => hover(null)}
					onClick={handleClick}
				>
					<planeGeometry args={[layout.span + 0.04, SLEEVE]} />
					<meshBasicMaterial visible={false} />
				</mesh>
			)}

			{hovered && !selectedId && <SpineTooltip record={hovered} />}
		</group>
	)
}

function SpineTooltip({ record }: { record: PlacedRecord }) {
	return (
		<Html
			position={[record.x, RECORD_Y + 0.163, 0.17]}
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
