# motion — build-time composition rendering

Remotion project that renders the site's explanatory motion assets. It is a
**separate package**: its own `package.json`, its own `node_modules`, excluded
from the website's `tsconfig.json` and from Biome's scope. Nothing here is
imported by anything under `src/`, and no Remotion package appears in the
website's dependency tree or in any customer-facing JavaScript chunk.

What the website consumes is the output: an H.264 MP4 and a WebP poster per
composition per theme, in `public/motion/`, plus the generated manifest
`src/content/motion-assets.ts`.

## Commands

From the repository root:

```bash
bun run motion:render
```

```bash
bun run motion:studio
```

`motion:render` renders every composition and rewrites the manifest.
`motion:studio` opens the Remotion Studio for previewing and editing.

Render a subset while iterating (the manifest is left alone so it can never
end up half-written):

```bash
bun run motion:render aegis
```

Output filenames are content-hashed — `<id>-<theme>.<sha8>.mp4` — so
`public/motion/` is deployed with a one-year immutable cache
(`scripts/deploy.sh`), and a re-render publishes a new URL rather than
fighting a cache. The render script deletes the previous hash of each asset,
so the folder never accumulates orphans.

## Rules these compositions follow

- **Every composition explains one operating idea** that is harder to grasp
  from a still. If it cannot be stated in one sentence, it does not get built.
- **No title cards.** The last frame is the finished diagram, and that frame is
  also the poster — so the still has to carry the whole idea on its own.
- **Play once, hold the last frame.** Nothing loops.
- **Silent.** No audio track is rendered at all.
- **Legible at ~340px wide.** That is a 3.8× reduction from the 1280px canvas,
  so anything a reader must actually read is at least 34px on canvas
  (`type.label` in `src/theme.ts`), and there are few words per screen.
- **No invented proof.** No customer names, no telemetry, no collection rates,
  no uptime figures, no certifications. Illustrative labels only.
- **Restrained motion**: opacity, translate, line-draw and status transition.
  No particles, no 3D, no spin, no confetti.
- **Two themes.** Each composition renders light and dark. Only one file is
  ever fetched by a visitor — the delivery component picks the variant after
  reading `data-theme`.

## Layout

| File | What it holds |
|---|---|
| `src/theme.ts` | Colours, type scale and canvas geometry, mirroring the site's tokens |
| `src/fonts.ts` | Sora / IBM Plex Sans / IBM Plex Mono, the site's own faces |
| `src/kit.tsx` | The shared primitives every composition is built from |
| `src/compositions/` | The four composition families |
| `src/registry.ts` | The one list of compositions, variants and tiers |
| `scripts/render.ts` | Renders, content-hashes and writes the manifest |

`tier` in the registry follows the motion priority matrix: tier 1 ships a video
and a poster; tier 2 ships the poster only.

## Licence

Remotion is free for individuals and for companies of up to three people; a
paid Company Licence becomes mandatory at four or more people operating the
Remotion software. Confirm Fairhelm's current headcount against
<https://www.remotion.pro/license> before relying on the free licence.
