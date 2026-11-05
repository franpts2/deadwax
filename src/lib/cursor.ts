export type CursorState = "grab" | "grabbing" | "pointer"

/** Only touch the DOM when the cursor actually changes. */
export function setCursor(element: HTMLElement, cursor: CursorState): void {
	if (element.style.cursor !== cursor) element.style.cursor = cursor
}
