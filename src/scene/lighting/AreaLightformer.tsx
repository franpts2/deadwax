import { Lightformer } from "@react-three/drei"

export type AreaLightProps = {
	intensity: number
	color: string
	scale: [number, number, number]
	position: [number, number, number]
	rotation?: [number, number, number]
}

/** One soft area light, rendered into the environment map. */
export function AreaLightformer({ intensity, color, scale, position, rotation }: AreaLightProps) {
	return (
		<Lightformer
			form="rect"
			intensity={intensity}
			color={color}
			scale={scale}
			position={position}
			rotation={rotation}
		/>
	)
}
