# Vinyl Shelf

A three-dimensional shelf of records. Spines out, one after another, the way they
actually sit in a room. Pull one out and it turns to face you, the cover appears, and
the disc slides out of the sleeve.

This repo is being built in slices. **Week 1 slice:** one shelf, 152 records, drag/wheel
panning, spine hover labels, depth of field, and the full pull-out choreography with the
disc reveal. No backend yet — the collection is a fixture file.

See [`PLAN.md`](./PLAN.md) for the product plan, data model, realism notes, performance
budget and roadmap.

## Stack

- Vite + React 19 + TypeScript
- three.js via `@react-three/fiber` and `drei`
- `@react-spring/three` for the physical motion
- Tailwind CSS 4

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run typecheck
```

## How it is put together

```
src/
  data/          fixture collection, layout maths
  lib/           dimensions, seeded randomness
  lib/textures/  procedural canvas textures (spines, covers, disc, wood)
  scene/         R3F scene: shelf, record, camera rig, lighting, DOF
  store/         selection state (zustand)
  ui/            HTML overlay and metadata card
```

Everything in the scene is generated in code — there are no model files or image
assets yet. Spine artwork, cover art and the disc grooves are drawn to canvases at
runtime, which keeps the repo small and makes it trivial to swap in real scans later.

### Geometry

A sleeve is a real object: 314 mm square, 3.3–7.5 mm thick, and every record gets its
own thickness, depth jitter and lean so the row never looks like a texture strip. The
front cover faces −X and the printed spine faces +Z, so pulling a record out is a
translate followed by a 90° turn.

### Choreography

The pull-out is sequenced, not simultaneous: the sleeve slides clear of the row first,
then turns. Turning in place would sweep a 314 mm sleeve through its neighbours. The
return reverses the order. The disc lives inside the sleeve and slides up as the record
faces the camera, so only a crescent of vinyl shows above the cover.

### Interaction

One invisible plane sits at the spine plane and snaps the pointer x to the nearest
spine, instead of raycasting 152 thin hitboxes. That stays accurate when a spine is
8 px wide. Dragging pans the row; a drag never selects, because clicks with movement
are rejected.

### Notes for the next slice

- Spine textures are one canvas per record (~14 MB of GPU memory at 152 records).
  Move to a per-shelf texture atlas with KTX2 before the collection grows.
- Covers and disc faces are generated lazily on selection and cached; real scans will
  follow the same path.
- The bundle is ~1.35 MB (~384 kB gzip), dominated by three/drei/postprocessing. Split
  the scene out of the initial chunk before shipping.
- Backend: accounts, collections, public shelves, Discogs import.
