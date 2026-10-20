import { useDisposable } from "../hooks/useDisposable"
import { createBackdropTexture } from "../lib/textures/backdrop"

/** The dark wall the shelf hangs on. Rendered, not CSS, so post-processing sees it. */
export function Backdrop() {
	const texture = useDisposable(() => createBackdropTexture(), [])

	return (
		<mesh position={[0, 1.0, -1.7]}>
			<planeGeometry args={[9, 5.6]} />
			<meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
		</mesh>
	)
}
