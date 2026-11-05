import { DepthOfField, EffectComposer } from "@react-three/postprocessing"
import {
	DOF_BOKEH_SCALE,
	DOF_FOCUS_RANGE,
	DOF_FOCUS_RECORD,
	DOF_FOCUS_SHELF,
	DOF_RESOLUTION_SCALE,
} from "../constants/effects"
import { useSelection } from "../store/selection"

/**
 * Depth of field only. Focus sits on the shelf until a record is pulled out,
 * then follows it forward so the row behind goes soft.
 */
export function Effects() {
	const selectedId = useSelection((state) => state.selectedId)

	return (
		<EffectComposer multisampling={4}>
			<DepthOfField
				focusDistance={selectedId ? DOF_FOCUS_RECORD : DOF_FOCUS_SHELF}
				focusRange={DOF_FOCUS_RANGE}
				bokehScale={DOF_BOKEH_SCALE}
				resolutionScale={DOF_RESOLUTION_SCALE}
			/>
		</EffectComposer>
	)
}
