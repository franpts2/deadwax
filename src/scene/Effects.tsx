import { DepthOfField, EffectComposer } from "@react-three/postprocessing"
import { useShelf } from "../store/shelf"

/**
 * Depth of field only. Focus sits on the shelf until a record is pulled out,
 * then follows it forward so the row behind goes soft.
 */
export function Effects() {
	const selectedId = useShelf((state) => state.selectedId)

	return (
		<EffectComposer multisampling={4}>
			<DepthOfField
				focusDistance={selectedId ? 0.66 : 0.74}
				focusRange={0.26}
				bokehScale={2.1}
				resolutionScale={0.7}
			/>
		</EffectComposer>
	)
}
