import { Canvas } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"
import { CAMERA_Y, CAMERA_Z } from "./lib/dimensions"
import { clamp } from "./lib/random"
import { Scene } from "./scene/Scene"
import { useShelf, view } from "./store/shelf"
import { Overlay } from "./ui/Overlay"

export default function App() {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				useShelf.getState().select(null)
				return
			}
			if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
				const direction = event.key === "ArrowLeft" ? -1 : 1
				event.preventDefault()
				view.targetX = clamp(view.targetX + direction * 0.06, -view.maxPan, view.maxPan)
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])

	return (
		<div className="scene-room film-grain vignette relative h-dvh w-full overflow-hidden">
			<Canvas
				shadows
				dpr={[1, 1.8]}
				camera={{ fov: 32, near: 0.05, far: 30, position: [0, CAMERA_Y, CAMERA_Z] }}
				gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
				onCreated={({ gl }) => {
					gl.toneMapping = THREE.ACESFilmicToneMapping
					gl.toneMappingExposure = 0.9
					gl.domElement.style.cursor = "grab"
				}}
			>
				<Scene />
			</Canvas>
			<Overlay />
		</div>
	)
}
