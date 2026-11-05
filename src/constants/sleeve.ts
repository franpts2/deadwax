/** Sleeve and disc geometry, in metres. 1 scene unit = 1 metre. */

export const SLEEVE = 0.314 // 12.375in
export const HALF = SLEEVE / 2

/** The printed spine is a plane floating a fraction of a millimetre off the board. */
export const SPINE_HALF = 0.00015
export const SPINE_Z = HALF + SPINE_HALF

/** Covers sit just off the sleeve faces so they never z-fight. */
export const COVER_OFFSET = 0.0003

/** Air between neighbours in the row. */
export const GAP = 0.0008

export const DISC_RADIUS = 0.15
export const DISC_THICKNESS = 0.0018
