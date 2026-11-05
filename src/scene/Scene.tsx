import { useMemo } from "react"
import { layoutRecords } from "../data/layout"
import { RECORDS } from "../data/records"
import { Backdrop } from "./Backdrop"
import { CameraRig } from "./CameraRig"
import { Effects } from "./Effects"
import { Lighting } from "./lighting/Lighting"
import { Shelf } from "./Shelf"

export function Scene() {
	const layout = useMemo(() => layoutRecords(RECORDS), [])

	return (
		<>
			<Backdrop />
			<Lighting />
			<Shelf layout={layout} />
			<CameraRig layout={layout} />
			<Effects />
		</>
	)
}
