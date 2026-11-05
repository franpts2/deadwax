# Deadwax

<div align="left">
	<img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
	<img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
	<img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
	<img src="https://img.shields.io/badge/three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="three.js"/>
	<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License"/>
</div>

A three-dimensional shelf of records, spines out, the way they actually sit in a room.
Pull one out and it turns to face you: the cover appears and the disc slides out of the
sleeve.

Named for the run-out groove, **Deadwax** is a browser experiment in physical
interaction, procedural graphics and performance.

**Status:** week 1 slice — one shelf, 152 records, full pull-out choreography. The
collection is a fixture file; there is no backend yet.

## About

Instead of a grid of thumbnails, this project renders a record collection as a physical
row. Every sleeve has its own thickness, depth jitter and lean, and every spine, cover,
disc groove and wood surface is drawn in code at runtime — the repository contains no
image or model assets.

The goal is a shelf that is genuinely browsable: pan along it by eye, hover a spine for
metadata, and pull a record out to see the cover and the disc.

## Key Features

- **Physical shelf** — 152 records laid out edge to edge, each with individual
  thickness, depth and lean.
- **Drag, wheel and keyboard panning** — browse the row with a pointer, trackpad or the
  arrow keys.
- **Hover labels** — an HTML tooltip pinned above the hovered spine, readable even when
  a spine is only a few pixels wide.
- **Pull-out choreography** — the sleeve clears the row, turns 90°, the cover faces the
  camera and the disc slides up out of the sleeve. Esc reverses it.
- **Procedural artwork** — spines, covers, disc faces, grooves, wood and the backdrop are
  generated on canvases at runtime from seeded randomness.
- **Cinematic camera** — damped panning, a slow handheld drift, and depth of field that
  follows the selected record.
- **Reduced motion** — camera drift and bob are disabled when the OS requests it.
- **Accessible metadata** — selection details are real DOM text, not canvas pixels.
- **Deterministic** — the same record always gets the same artwork and placement.

## Controls

| Action | Control |
| --- | --- |
| Browse the shelf | Drag, scroll wheel / trackpad, or ← / → |
| Inspect a record | Click a spine; hover for a label |
| Return a record | Esc, or click the pulled record |

## Live Demo

Live at: [https://deadwax.franciscapt.dev](https://deadwax.franciscapt.dev)

To run it locally instead:

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Technical Implementation

**Tech Stack**

- Framework: React 19 + TypeScript
- 3D: three.js via `@react-three/fiber` and `drei`
- Animation: `@react-spring/three` plus frame-loop damping
- Styling: Tailwind CSS v4
- State: Zustand
- Build tool: Vite 8
- Post-processing: `@react-three/postprocessing` (depth of field)

**Folder Structure**

```text
deadwax/
├── public/
│   └── favicon.svg
├── src/
│   ├── constants/       ← sleeve, shelf, camera, interaction, animation tuning
│   ├── data/            ← fixture collection, palettes, types, layout maths
│   ├── hooks/           ← disposal, keyboard, reduced motion
│   ├── lib/             ← pure helpers: seeded random, colour, slug, cursor, pointer
│   │   └── textures/    ← procedural canvas textures
│   │       ├── cover/
│   │       ├── disc/
│   │       └── spine/
│   ├── scene/           ← R3F canvas, shelf, record, camera rig, lighting, DOF
│   │   ├── camera/
│   │   ├── lighting/
│   │   ├── record/
│   │   └── shelf/
│   ├── store/           ← selection state and mutable camera pan
│   ├── ui/              ← HTML overlay components
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**How it fits together**

- Components compose, hooks animate, `lib/` draws. One component per file, named after
  the file; tuning numbers live in `constants/` so a value is never written twice.
- An invisible plane sits at the spine plane and snaps the pointer to the nearest spine,
  instead of raycasting 152 thin hitboxes.
- Dragging never selects: a click with movement is rejected.
- The pull-out is sequenced, not simultaneous, so a 314 mm sleeve never sweeps through
  its neighbours. The return reverses the order.
- Covers and disc faces are generated lazily on selection and cached.

## Getting Started

**Prerequisites:** Node.js 20.19+ or 22.12+. An `.nvmrc` is included — run `nvm use`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck  # TypeScript only
npm run deploy     # build and deploy to Cloudflare Workers
```

## Deployment

Deadwax is hosted on Cloudflare Workers Static Assets at
[deadwax.franciscapt.dev](https://deadwax.franciscapt.dev). The Worker and its custom
domain are declared in [`wrangler.jsonc`](./wrangler.jsonc), so a deploy only needs:

```bash
npm run deploy
```

## Roadmap

- [x] One shelf, 152 records, panning, hover labels, pull-out and disc reveal
- [x] Procedural spine, cover, disc and wood textures
- [x] Depth of field, reduced-motion support, keyboard controls
- [ ] Search and filters
- [ ] HTML grid fallback for accessibility and SEO
- [ ] Deep links to individual records
- [ ] Discogs import and a real backend (D1 + R2)
- [x] Deployment to Cloudflare Workers

## Performance Notes

- Spine textures are currently one canvas per record (~14 MB of GPU memory at 152
  records). A per-shelf texture atlas with KTX2 is the next step.
- The production bundle is ~1.35 MB (~384 kB gzip), dominated by three/drei/
  postprocessing. The scene should be split out of the initial chunk before shipping.
- Covers and disc faces are generated lazily and cached.

## License

MIT © 2026 Francisca Portugal. See [LICENSE](./LICENSE).

## Notes

- Album titles, artists, years and labels are used as factual metadata. No real cover
  artwork, scans or audio is included; all artwork is generated procedurally.
- Fonts are Instrument Serif and Inter, loaded from Google Fonts.

---

_Deadwax by Francisca Portugal — frontend engineer._
