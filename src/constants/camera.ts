/** One source of truth for the lens: SceneCanvas and the rig must agree. */
export const FOV = 32
export const HALF_FOV = (FOV / 2) * (Math.PI / 180)

export const CAMERA_Y = 1.0
export const CAMERA_Z = 0.8
export const FOCUS_CAMERA_Z = 1.06
export const LOOK_Y = 0.965

/**
 * The shelf is dense: a sleeve can only turn 90° once it is clear of its
 * neighbours. At 45° a 314mm sleeve sweeps 111mm backwards, so the record has
 * to travel ~330mm out of the row before it starts to turn.
 */
export const FOCUS_Z = 0.33
export const FOCUS_LOOK_Z = 0.3

/** Camera micro-drift, in metres. */
export const CAMERA_DRIFT = 0.0012
export const CAMERA_BOB = 0.0007
