export const SLEEVE = 0.314 // 12.375in, in metres
export const HALF = SLEEVE / 2
export const SPINE_HALF = 0.00015 // spine art floats a fraction of a mm off the board
export const SPINE_Z = HALF + SPINE_HALF // depth of the spine face in shelf space

export const SHELF_BASE_Y = 0.8
export const RECORD_Y = SHELF_BASE_Y + HALF

/**
 * The shelf is dense: a sleeve can only turn 90° once it is clear of its
 * neighbours. At 45° a 314mm sleeve sweeps 111mm backwards, so the record has
 * to travel ~330mm out of the row before it starts to turn.
 */
export const FOCUS_Z = 0.33
export const CAMERA_Z = 0.8
export const FOCUS_CAMERA_Z = 1.06
export const CAMERA_Y = 1.0
export const LOOK_Y = 0.965

export const GAP = 0.0008

export const DISC_RADIUS = 0.15
export const DISC_THICKNESS = 0.0018
export const LABEL_RADIUS = 0.05
