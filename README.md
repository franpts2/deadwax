# Vinyl Shelf

A three-dimensional shelf of records. Spines out, one after another, the way they
actually sit in a room. Pull one out and it turns to face you, the cover appears, and
the disc slides out of the sleeve.

This repo is being built in slices. **Week 1 slice:** a single shelf, 140 records,
horizontal panning, hover labels, and the full pull-out choreography with the disc
reveal. No backend yet — the collection is a fixture file.

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
  scene/         R3F scene: shelf, record, camera rig, lighting
  store/         selection state (zustand)
  ui/            HTML overlay
```

Everything in the scene is generated in code — there are no model files or image
assets yet. Spine artwork, cover art and the disc grooves are drawn to canvases at
runtime, which keeps the repo small and makes it trivial to swap in real scans later.

### Notes for the next slice

- Spine textures are one canvas per record (~20 MB of GPU memory at 140 records).
  Move to a per-shelf texture atlas with KTX2 before the collection grows.
- Covers are generated lazily on selection and cached; real scans will follow the
  same path.
- Interaction uses a single invisible plane in front of the shelf and snaps to the
  nearest spine. This stays accurate even when a spine is 8 px wide, and avoids
  raycasting 140 hitboxes.
