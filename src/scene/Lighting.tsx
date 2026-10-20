import { Environment, Lightformer } from "@react-three/drei"

/**
 * A small room built out of emissive cards: warm key from above, cool daylight
 * from the left, a weak amber kicker on the right. No HDR file to download.
 */
export function Lighting() {
	return (
		<>
			<Environment resolution={256} frames={1}>
				<Lightformer
					form="rect"
					intensity={1.45}
					color="#ffd7ae"
					scale={[7, 2.4, 1]}
					position={[0, 3.2, 1.4]}
					rotation={[-Math.PI / 2.3, 0, 0]}
				/>
				<Lightformer
					form="rect"
					intensity={0.6}
					color="#9dbcff"
					scale={[4, 3, 1]}
					position={[-3.4, 0.9, 2]}
					rotation={[0, Math.PI / 2.6, 0]}
				/>
				<Lightformer
					form="rect"
					intensity={0.45}
					color="#ffb27a"
					scale={[3, 2, 1]}
					position={[3.4, 0.5, 1.2]}
					rotation={[0, -Math.PI / 3, 0]}
				/>
				<Lightformer
					form="rect"
					intensity={0.32}
					color="#c8d4e8"
					scale={[6, 3, 1]}
					position={[0, 1.1, 4]}
					rotation={[0, 0, 0]}
				/>
			</Environment>

			<ambientLight intensity={0.1} color="#b9a894" />

			<spotLight
				position={[-0.45, 2.0, 1.15]}
				target-position={[0, 0.95, 0]}
				angle={0.62}
				penumbra={1}
				intensity={2.8}
				color="#ffd9b0"
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-bias={-0.0003}
				shadow-normalBias={0.004}
				shadow-camera-near={0.5}
				shadow-camera-far={6}
			/>

			<directionalLight position={[-1.6, 1.3, 1.3]} intensity={0.38} color="#a9c2ff" />

			{/* A soft strip under the top board so the case reads as wood, not a black band. */}
			<pointLight position={[0, 1.115, 0.16]} intensity={0.22} distance={0.6} decay={2} color="#ffcf9e" />
		</>
	)
}
