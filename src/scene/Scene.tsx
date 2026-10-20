import { useMemo } from "react"
import { layoutRecords } from "../data/layout"
import { RECORDS } from "../data/records"
import { createCanvas, canvasTexture } from "../lib/textures/canvas"
import { CameraRig } from "./CameraRig"
import { Effects } from "./Effects"
import { Lighting } from "./Lighting"
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

/** The dark wall the shelf hangs on. Rendered, not CSS, so post-processing sees it. */
function Backdrop() {
	const texture = useMemo(() => {
		const { canvas, ctx } = createCanvas(512, 512)
		const gradient = ctx.createRadialGradient(256, 210, 20, 256, 260, 340)
		gradient.addColorStop(0, "#1d1714")
		gradient.addColorStop(0.42, "#120f10")
		gradient.addColorStop(0.75, "#0a0809")
		gradient.addColorStop(1, "#050405")
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, 512, 512)
		return canvasTexture(canvas)
	}, [])

	return (
		<mesh position={[0, 1.0, -1.7]}>
			<planeGeometry args={[9, 5.6]} />
			<meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
		</mesh>
	)
}
