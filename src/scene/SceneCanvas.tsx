import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { CAMERA_Y, CAMERA_Z, FOV } from "../constants/camera"
import { setCursor } from "../lib/cursor"
import { Scene } from "./Scene"

/** Renderer setup lives here so App stays a plain shell. */
export function SceneCanvas() {
	return (
		<Canvas
			shadows
			dpr={[1, 1.8]}
			camera={{ fov: FOV, near: 0.05, far: 30, position: [0, CAMERA_Y, CAMERA_Z] }}
			gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
			onCreated={({ gl }) => {
				gl.toneMapping = THREE.ACESFilmicToneMapping
				gl.toneMappingExposure = 0.9
				setCursor(gl.domElement, "grab")
			}}
		>
			<Scene />
		</Canvas>
	)
}
