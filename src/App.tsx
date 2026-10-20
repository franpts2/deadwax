import { useShelfKeyboard } from "./hooks/useShelfKeyboard"
import { SceneCanvas } from "./scene/SceneCanvas"
import { Overlay } from "./ui/Overlay"

export default function App() {
	useShelfKeyboard()

	return (
		<div className="scene-room film-grain vignette relative h-dvh w-full overflow-hidden">
			<SceneCanvas />
			<Overlay />
		</div>
	)
}
