import * as THREE from "three"
import { DISC_RADIUS, DISC_THICKNESS } from "../constants/sleeve"

/**
 * Geometry singletons. They are created once per module and shared by every
 * record; per-record variation comes from the mesh scale, not the geometry.
 */
export const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)
export const UNIT_PLANE = new THREE.PlaneGeometry(1, 1)

export const DISC_GEOMETRY = (() => {
	const geometry = new THREE.CylinderGeometry(DISC_RADIUS, DISC_RADIUS, DISC_THICKNESS, 96, 1)
	// Axis along X so the label faces -X, the same way as the front cover.
	geometry.rotateZ(Math.PI / 2)
	return geometry
})()

/** Cylinder material groups, in the order three.js assigns them. */
export const DISC_MATERIAL_GROUP = {
	EDGE: 0,
	FACE: 1,
	BACK: 2,
} as const
