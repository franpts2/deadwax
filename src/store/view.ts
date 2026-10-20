/**
 * Mutable camera state. Lives outside React so panning a shelf of 152 records
 * never re-renders the scene.
 */
export const view = {
	targetX: 0,
	maxPan: 0,
}
