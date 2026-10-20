import { Environment } from "@react-three/drei"
import { AreaLightformer, type AreaLightProps } from "./AreaLightformer"

/** Warm key from above, cool daylight from the left, a weak amber kicker on the right. */
const AREA_LIGHTS: AreaLightProps[] = [
	{
		intensity: 1.45,
		color: "#ffd7ae",
		scale: [7, 2.4, 1],
		position: [0, 3.2, 1.4],
		rotation: [-Math.PI / 2.3, 0, 0],
	},
	{
		intensity: 0.6,
		color: "#9dbcff",
		scale: [4, 3, 1],
		position: [-3.4, 0.9, 2],
		rotation: [0, Math.PI / 2.6, 0],
	},
	{
		intensity: 0.45,
		color: "#ffb27a",
		scale: [3, 2, 1],
		position: [3.4, 0.5, 1.2],
		rotation: [0, -Math.PI / 3, 0],
	},
	{
		intensity: 0.32,
		color: "#c8d4e8",
		scale: [6, 3, 1],
		position: [0, 1.1, 4],
	},
]

/** A small room built out of emissive cards. No HDR file to download. */
export function StudioEnvironment() {
	return (
		<Environment resolution={256} frames={1}>
			{AREA_LIGHTS.map((light, index) => (
				<AreaLightformer key={index} {...light} />
			))}
		</Environment>
	)
}
