import { CLICK_SLOP } from "../constants/interaction"

/** `event.delta` is pointer travel in pixels since pointerdown. */
export function isClick(delta: number): boolean {
	return delta < CLICK_SLOP
}
