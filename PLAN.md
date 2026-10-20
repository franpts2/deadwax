# Vinyl Shelf — Product & Build Plan

A 3D shelf that shows your records the way they actually sit on the shelf — spines out,
edge to edge — and lets you pull one out to see the cover and the disc.

---

## 0. TL;DR — the decisions I'd make

| Question | Recommendation | Why |
|---|---|---|
| Rendering | `three` + `@react-three/fiber` + `drei` | Declarative scene, easy interaction/camera work, matches your React/Tailwind stack |
| Geometry | Procedural (code), not Blender | Sleeve = rounded box, disc = cylinder/lathe. No modelling pipeline to maintain |
| Data at MVP | Static JSON generated from a Discogs CSV export | Zero backend, instant deploy, real data on day one |
| Data at v1 | Cloudflare D1 + R2 + Images | Editing, filtering at scale, cached cover art |
| Search | Client-side Fuse.js over a few hundred records | Sub-ms, no API, works offline |
| Spines | One texture atlas per shelf, KTX2 compressed | 60 spines ≈ one 4K atlas, one draw call if instanced |
| Shelf size | 40–60 records per shelf, 3–6 shelves in a "room" | Keeps spines ≥ 12px wide on screen; matches a real Kallax cube |
| Fallback | HTML grid view, real routes, keyboard nav | 3D-only breaks accessibility and SEO |
| Hosting | Cloudflare Pages | Static-first, cheap, images/R2 available later |

**Biggest risk:** a 5 mm spine is ~14 px wide at normal viewing distance. Realism and
legibility fight each other. The plan below resolves it with hover labels, zoom-on-click,
and a list view — not by making the shelf fake-wide.

---

## 1. One sentence

> A living 3D shelf of my record collection: physically arranged, browsable by eye,
> searchable by brain, and satisfying to pull a record off of.

**Audience:** primarily you (a personal collection site you're proud to link to), secondarily
friends/visitors browsing it. That means: read-only and fast for visitors, editable for you
behind auth.

**Non-goals (v1):** social features, marketplace, wishlist trading, multi-user accounts,
audio playback of the records themselves.

---

## 2. The experience, beat by beat

1. **Arrival.** Dark, warm room. One shelf lit from above, ~50 spines in a row. Camera at
   chest height, slight depth of field, very slow handheld drift. A counter: `312 records`.
2. **Browse.** Scroll/drag horizontally = camera pans along the shelf. Records further away
   blur slightly. Hovering a spine nudges it out 1.5 mm and shows a small HTML label
   (artist — title, year).
3. **Pull.** Click. The sleeve slides out of the row along its own normal, rotates a few
   degrees, and eases to a presentation position in front of the camera. The camera also
   eases in — you never see a scale-up.
4. **Reveal.** The disc slides out of the sleeve about a quarter of its diameter, tilts 3°,
   and turns slowly. Groove normal map + anisotropic sheen gives a moving specular sweep.
   Colored vinyl actually reads as colored vinyl.
5. **Read.** A metadata panel slides in: artist, title, year, label, pressing, genres,
   condition, notes, tracklist. The room light picks up the album's dominant color.
6. **Return.** Esc / click outside. Everything springs back into the exact same slot,
   with a small overshoot so it feels physical.
7. **Filter.** Pick `Jazz` + `1970s`. Non-matching records drop away, the row closes the
   gaps with a staggered spring, counter updates. The shelf is now a filtered shelf.
8. **Search.** `Cmd/Ctrl+K`, fuzzy type-ahead. Selecting a result flies the camera to that
   shelf and pulls the record out. The URL updates so the view is shareable.

---

## 3. Scope

### MVP — "it's real and it's mine"
- [ ] One shelf, 40–60 records, real data
- [ ] Spines with generated text textures, varied widths/tones/lean
- [ ] Hover label + click-to-pull choreography
- [ ] Cover + disc reveal
- [ ] Category filters (genre, artist, decade) + text search
- [ ] Deep link per record (`/record/:slug`) that opens it in 3D
- [ ] HTML grid fallback + responsive layout
- [ ] Deployed

### v1 — "collection management"
- [ ] Multiple shelves, camera travel between them
- [ ] Admin CRUD (add/edit/delete a copy), drag to reorder shelf positions
- [ ] Discogs CSV import + API enrichment script
- [ ] Cover art cached in R2, dominant-color placeholders
- [ ] Sort modes: physical shelf order vs. virtual display sort
- [ ] Auth for admin (Cloudflare Access or a signed cookie), public read-only
- [ ] Shareable filter URLs, saved "crates" (e.g. "Desert island")

### Later — delight
- [ ] Gatefold open animation, inner sleeve, booklet
- [ ] Turntable + Now Playing (Last.fm)
- [ ] Barcode scan to add a record
- [ ] "Leaning records" at the end of a partially filled shelf
- [ ] Ambient light reacts to cover palette; subtle room reflections
- [ ] Crate/browse mode for very large collections (face-on flipping)
- [ ] Export shelf as an image for sharing

---

## 4. Realism playbook

Realism here is 20% geometry and 80% light, material, imperfection, and camera. Ranked by
impact per hour:

**High impact, cheap**
- **Long lens, low FOV.** Use `fov ≈ 30–35°`. Wide-angle is the #1 tell of a 3D scene.
  Add subtle DOF so the shelf falls off front-to-back.
- **ACES tone mapping**, exposure ~1.0–1.15, slight lift in the shadows. Warm key
  (≈3000K) + cool daylight fill. Never pure white key light.
- **Imperfection.** Vary spine width (3–6 mm), lean (±1.5°), depth pushed in (±0.5 mm),
  paper tone (off-white → cream → grey), and text placement. Uniformity looks fake
  instantly.
- **Baked AO instead of real shadows.** Dark gradient at the bottom of each spine and in
  the gaps between records. Shadow maps for 200 records is a performance trap and looks
  worse than a good gradient.
- **Paper grain normal map** on every surface + roughness variation. Sleeves are not
  plastic — except the ones in outer sleeves, which are.
- **Bevels.** 0.2–0.4 mm bevel on sleeve edges catches light and reads as paper thickness.
- **Camera micro-drift**, 1–2 px amplitude, disabled under `prefers-reduced-motion`.
- **Not every spine has text.** Some are blank white, some are printed with only the
  label, some read bottom-to-top (US) and some top-to-bottom (EU).

**Worth the budget**
- Real HDR environment (1–2k, KTX2) for reflections on laminated covers.
- **Clearcoat, not transparency,** for plastic outer sleeves. Alpha transparency on 50
  overlapping sleeves = sorting artifacts and overdraw. `clearcoat` looks the same and is
  free.
- Disc: radial groove normal map + anisotropic roughness. It is the single most
  convincing material in the scene — the sheen must move when the disc turns.
- Ring wear / edge scuffs baked into generated cover textures (subtle multiply layer).

**Skip for now**
- Real-time GI, volumetric dust, cloth simulation, physically accurate shelf physics.
- Photogrammetry. Procedural + good materials beats a mediocre scan.

---

## 5. Technical architecture

```
Browser
 ├─ React 19 + TS + Tailwind 4 + Vite
 ├─ <Canvas> (R3F)
 │   ├─ Scene: room shell, shelves, lights, env
 │   ├─ Shelf: merged wood + N record groups
 │   ├─ Record: sleeve (rounded box, 3 material groups) + disc + inner sleeve
 │   ├─ Post: N8AO, DOF, bloom (subtle), vignette, grain
 │   └─ Interaction: raycast hitboxes, camera rig, springs
 ├─ HTML UI layer: filters, search palette, metadata panel, grid view
 └─ State: zustand (scene/selection) + URL search params (filters)

Data
 ├─ MVP: /public/data/records.json  (build-time imported from Discogs)
 └─ v1:  Workers API → D1 (SQLite) ; R2 for covers ; Cloudflare Images transforms
```

**Key libraries:** `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/postprocessing` (+ `n8ao`), `@react-spring/three` (or `maath` damping),
`zustand`, `fuse.js`, `react-router`.

**Why R3F over vanilla three:** you get React state for "which filter is active" driving
the scene declaratively, and drei gives you `Environment`, `Bvh` raycasting, `Html`,
`AdaptiveDpr` and `useGLTF`/texture helpers for free. Vanilla three would mean writing all
of that.

**Geometry:** all procedural.
- Sleeve: `RoundedBoxGeometry` 314 × 314 × 4 mm, bevel 0.4 mm, material groups for spine /
  front / back / paper edge.
- Disc: `CylinderGeometry` r=150 mm, 0.8 mm tall, 64–96 segments + a label disc on top.
- Shelf: box with a routed front lip; wood via color + roughness + normal maps.

**The one genuinely tricky bit:** the pull-out animation. A record lives in shelf-local
space; the presentation position is defined in camera space. Recommendation: **do not
reparent on click.** Compute the target world matrix from a camera-anchored "presentation
anchor" each frame, convert it to shelf-local with `shelf.worldToLocal` /
`parent.matrixWorld.invert()`, and spring the record's local transform toward it. Reparenting
mid-animation causes a one-frame pop and is a classic bug source.

**Animation:** one spring per property (`position`, `quaternion`, `scale`). Use
`ease-out-expo` for the initial pull (~450 ms) and a spring with damping ~0.85 for the
settle. Total choreography 900–1200 ms. Slerp quaternions — never lerp Euler angles.

**Hit targeting:** spines are 5 mm wide. Give each record an invisible hitbox ~3× wider
(15 mm) and slightly taller than the spine, placed just in front of it. Use
`<Bvh>` for accelerated raycasting. Hover state debounced by ~60 ms so panning doesn't
flicker labels.

---

## 6. Data model

Separate **release** (the album as a product) from **copy** (the thing on your shelf).
Collectors care about the difference: pressing, condition, price, notes, signed.

```ts
type Release = {
  id: string
  discogsId?: number
  title: string
  artists: ArtistRef[]
  year?: number
  labels: string[]
  catalogNumber?: string
  genres: string[]        // Discogs "genres" (broad: Jazz, Rock)
  styles: string[]        // Discogs "styles" (narrow: Bebop, Post-Punk)
  formats: string[]       // 'LP', 'Album', 'Reissue', 'Gatefold'
  country?: string
  coverUrl: string        // cached, 1024² WebP
  spineImageUrl?: string  // optional real spine photo
  discColor: string       // hex or gradient stops
  discStyle: 'black' | 'color' | 'splatter' | 'picture' | 'clear'
  tracklist?: { position: string; title: string; duration?: string }[]
  dominantColor?: string
}

type Copy = {
  id: string
  releaseId: string
  shelfId: string
  position: number        // index in the physical shelf
  conditionMedia?: 'M' | 'NM' | 'VG+' | 'VG' | 'G+' | 'G'
  conditionSleeve?: string
  purchasePrice?: number
  purchasedAt?: string
  notes?: string
  signed?: boolean
  spineVariant: 'text' | 'blank' | 'label-only' | 'photo'
  thicknessMm: number     // 3 single, 6 gatefold, 12 box
  addedAt: string
}

type Shelf = {
  id: string
  name: string            // "Living room — left"
  order: number
  capacity?: number
}
```

Derived at build/runtime: `sortKey` (artist last name), `decade`, searchable blob,
dominant color, spine texture atlas coordinates.

---

## 7. Search & filter design

**Filters** (facets computed from data, multi-select, AND across types / OR within a type):
`Genre`, `Style`, `Artist`, `Decade`, `Label`, `Format`, `Condition`, `Shelf`.

**Search:** Fuse.js over `title + artist + label + genre + catalog# + notes`, threshold
~0.35, weighted (title 3, artist 2, everything else 1). Keyboard-first: `Cmd/Ctrl+K`,
arrows, enter.

**State lives in the URL:** `?genre=Jazz&decade=1970s&q=blue&record=kind-of-blue`.
This makes every filtered view shareable, makes back/forward work, and makes the 3D scene
a pure function of the URL — huge simplification.

**Filtering inside a physical shelf.** Two options; default to compacting.
- *Compact* (recommended): non-matching sleeves fade + drop, survivors slide together.
  Feels like the shelf rearranging itself; great for browsing 20 results.
- *Ghost slots*: keep positions, show empty gaps. Truer to "this is my shelf", useful
  when you want to see where things live. Toggle in settings.

**Sort modes:** `Shelf order` (physical, draggable, persisted — the default) and
`Virtual sort` (rearranges in 3D only, never mutates your real layout).

---

## 8. Performance budget

Target: 60 fps on a 2020 laptop, ≥ 40 fps on an iPhone 12, first interactive < 2.5 s.

| Budget | Target |
|---|---|
| Draw calls | < 150 |
| Triangles | < 250k |
| GPU texture memory | < 120 MB |
| JS bundle (initial) | < 350 KB gzip (three ~170 KB, R3F ~40 KB) |
| Cover images | lazy, 1024² WebP, ~150 KB each |

Techniques:
- **Spine atlas per shelf.** 128 × 1024 px per spine; 60 spines fit in a 4096² atlas.
  Compress with KTX2/Basis (`~8–16 MB` GPU, `~1–2 MB` transfer). One texture, one material.
- **Lazy shelves.** Render the active shelf + neighbours; mount/unmount the rest.
- **Instancing (v1 optimization).** If a shelf exceeds ~80 records, move spines to a
  single `InstancedMesh` with per-instance UV offset via `onBeforeCompile`. Only if
  profiling demands it — 80 individual meshes is fine.
- **Only the selected record** gets a 2048² cover and a high-poly disc.
- `AdaptiveDpr` + drop post-processing on low-end/mobile (`n8ao`, DOF, bloom all off).
- Preload the next shelf's atlas during idle (`requestIdleCallback`).
- Static assets on Cloudflare CDN, immutable caching, `Cache-Control: max-age=31536000`.

---

## 9. Accessibility, mobile, SEO

**Accessibility**
- Full HTML grid view (`/collection`) — same data, real `<a>` links, works without WebGL.
  Toggle in the header, and auto-fallback when WebGL is unavailable.
- Keyboard: arrows move along the shelf, Enter pulls the focused record, Esc returns.
  Visible focus ring on the spine (emissive outline, not color alone).
- Respect `prefers-reduced-motion`: no camera drift, 150 ms cross-fades instead of the
  full choreography, no disc spin.
- All metadata is real DOM text in the side panel, not 3D text — screen readers get it.
- Contrast-check the overlay UI against the scene (use a scrim behind text).

**SEO**
- Each record is a server-rendered page: `Title — Artist (Year) | My Vinyl Shelf`, cover
  image, description, `MusicAlbum` + `Person` JSON-LD.
- The 3D scene is a progressive enhancement that mounts on top.

**Mobile**
- A 5 mm spine on a 390 px viewport is a ~6 px target — unusable at full-shelf scale.
  So on small screens: **crate mode** — horizontal snap-scroll of face-on covers with the
  spine visible on the left edge, or a zoomed shelf showing ~8 spines at a time.
- No N8AO/DOF; cap DPR at 2; lower atlas resolution.
- Touch: tap = select + tooltip, second tap / "Pull" = open. Avoid hover-only affordances.

---

## 10. Build order

**Week 1 — prove the core loop**
1. Vite + React + TS + Tailwind scaffold, `<Canvas>`, tone mapping, one HDRI.
2. Procedural sleeve + disc, one shelf, 12 dummy records.
3. Camera rig + hover hitboxes + click → pull-out → return. *If this feels good, the
   project works. If it doesn't, no amount of filtering will save it.*
4. Get the disc specular right early — it's the shot people remember.

**Week 2 — real data, real shelf**
5. Discogs CSV export → `import.ts` → enrichment script (API, cached) → `records.json`.
6. Spine texture generator (canvas 2D → atlas), wear/imperfection pass.
7. 40–60 real records, multiple shelves, shelf navigation.
8. Cover + metadata panel, dominant color extraction.

**Week 3 — the utility layer**
9. Filters, facets, Fuse search, URL state.
10. Grid view + record routes + SEO meta.
11. Responsive/mobile mode, reduced motion, keyboard nav.

**Week 4 — own it**
12. D1 + R2 + admin CRUD, auth, image caching.
13. Perf pass against the budget above; Lighthouse; deploy.
14. Polish: lean, dust, transitions, loading state, empty state.

Rough effort: **3–4 weeks part-time**, of which ~40% is polish. The 3D core is smaller
than it feels; the data pipeline and the "everything else" is the bulk.

---

## 11. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Spine text unreadable at shelf scale | Core UX fails | Hover labels, zoom-on-click, list view, don't shrink spines |
| 3D-only site is inaccessible / unindexable | Bad product | HTML routes + grid view are first-class, not an afterthought |
| Cover art quality varies wildly (crops, color casts) | Breaks realism | Normalize to square, auto white-balance, consistent 1024² WebP, subtle shared grain over all covers |
| Discogs rate limits / image terms | Import stalls, legal | Cache everything to R2, credit Discogs, don't hotlink, keep a local JSON snapshot |
| Mobile perf | Unusable on phones | Separate mobile mode, no post-processing, lower res |
| Texture memory on 300+ records | Crashes low-end | Per-shelf atlases, lazy mount, KTX2 |
| Reparenting / Euler animation bugs | Janky hero moment | Single parent + computed target matrix, quaternion slerp, one spring per property |
| Scope creep (turntable, physics, room) | Never ships | MVP is one shelf and one perfect pull-out |

---

## 12. Open decisions (need your input)

1. **Collection size** — 50? 300? 1000+? This decides shelf segmentation and whether we
   need virtualized atlases and crate mode.
2. **Is this a personal site or a product?** Personal = read-only public, one admin.
   Product = accounts, multi-tenant, much bigger.
3. **Where does the data come from** — do you already have a Discogs account/export, or
   are we entering records by hand?
4. **Hosting preference** — Cloudflare (my recommendation, and what your other projects
   use), Vercel, or purely static GitHub Pages?
5. **Phone priority** — is "looks amazing on desktop" enough for v1, or must mobile be
   great at launch?
