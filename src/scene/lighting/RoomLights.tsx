/** Practical lights: the room's key, a cool fill and a strip under the top board. */
export function RoomLights() {
	return (
		<>
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
