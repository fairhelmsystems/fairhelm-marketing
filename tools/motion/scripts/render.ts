/**
 * Build-time render pipeline.
 *
 * Produces ordinary web assets — H.264 MP4 and a WebP poster — into the
 * website's `public/motion/` folder, then rewrites
 * `src/content/motion-assets.ts` so the site imports a plain manifest of
 * filenames. Nothing from Remotion is imported by the website: this script,
 * the compositions and every Remotion package live under `motion/`, which is
 * a separate package with its own `node_modules` and is excluded from the
 * site's tsconfig and Biome scope.
 *
 * Filenames are content-hashed (`<id>-<theme>.<sha8>.mp4`) so CloudFront can
 * serve them with a one-year immutable cache and a re-render publishes a new
 * URL instead of fighting the cache.
 *
 * Usage (from the repository root):
 *   bun run motion:render              # everything
 *   bun run motion:render aegis        # ids containing "aegis"
 */
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { compositionId, MOTION_ENTRIES, THEME_NAMES } from "../src/registry";
import { CANVAS } from "../src/theme";

const here = dirname(fileURLToPath(import.meta.url));
const MOTION_ROOT = resolve(here, "..");
const SITE_ROOT = resolve(MOTION_ROOT, "../../apps/squarecampus");
const PUBLIC_DIR = join(SITE_ROOT, "public", "motion");
const MANIFEST = join(SITE_ROOT, "src", "content", "motion-assets.ts");

const filter = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const matches = (id: string) =>
  filter.length === 0 || filter.some((f) => id.includes(f));

const sha8 = (file: string) =>
  createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);

const kb = (file: string) => Math.round(statSync(file).size / 1024);

/** Publish a hashed file. Previous assets remain until the manifest commits. */
function publish(tmp: string, base: string, ext: string) {
  const hash = sha8(tmp);
  const finalName = `${base}.${hash}.${ext}`;
  const finalPath = join(PUBLIC_DIR, finalName);
  if (tmp !== finalPath) {
    renameSync(tmp, finalPath);
  }
  return { name: finalName, sizeKb: kb(finalPath) };
}

type ManifestEntry = {
  id: string;
  family: string;
  tier: 1 | 2;
  description: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  segments?: { id: string; startFrame: number; durationInFrames: number }[];
  light: {
    mp4?: string;
    webm?: string;
    poster: string;
    stills?: Record<string, string>;
  };
  dark: {
    mp4?: string;
    webm?: string;
    poster: string;
    stills?: Record<string, string>;
  };
};

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });

  console.log("Bundling compositions…");
  const serveUrl = await bundle({
    entryPoint: join(MOTION_ROOT, "src", "index.ts"),
    onProgress: () => undefined,
  });

  const previous = (await import(pathToFileURL(MANIFEST).href))
    .motionAssets as Record<string, ManifestEntry>;
  const manifest: ManifestEntry[] = [];
  const report: string[] = [];

  for (const entry of MOTION_ENTRIES) {
    if (!matches(entry.id)) {
      if (!previous[entry.id])
        throw new Error(
          `Render ${entry.id} before publishing the complete manifest.`,
        );
      manifest.push(previous[entry.id]);
      continue;
    }

    const themed: Partial<Record<"light" | "dark", ManifestEntry["light"]>> =
      {};

    for (const theme of THEME_NAMES) {
      const id = compositionId(entry, theme);
      const composition = await selectComposition({
        serveUrl,
        id,
        inputProps: entry.props(theme),
      });

      // Poster first: it is the asset every visitor gets, including the ones
      // who never receive a video at all.
      const posterTmp = join(PUBLIC_DIR, `.tmp-${id}.webp`);
      await renderStill({
        composition,
        serveUrl,
        output: posterTmp,
        frame: entry.posterFrame,
        // `jpegQuality` is rejected for webp; Remotion's webp encoder is
        // already well inside the 100 KB poster target for flat vector art.
        imageFormat: "webp",
        inputProps: entry.props(theme),
        overwrite: true,
      });
      const poster = publish(posterTmp, `${entry.id}-${theme}`, "webp");
      report.push(`  poster ${poster.name.padEnd(46)} ${poster.sizeKb} KB`);

      const stills: Record<string, string> = {};
      for (const segment of entry.segments ?? []) {
        const frame = segment.startFrame + segment.durationInFrames - 1;
        if (frame === entry.posterFrame) {
          stills[segment.id] = `/motion/${poster.name}`;
          continue;
        }
        const stillTmp = join(PUBLIC_DIR, `.tmp-${id}-${segment.id}.webp`);
        await renderStill({
          composition,
          serveUrl,
          output: stillTmp,
          frame,
          imageFormat: "webp",
          inputProps: entry.props(theme),
          overwrite: true,
        });
        const still = publish(
          stillTmp,
          `${entry.id}-${theme}-stage-${segment.id}`,
          "webp",
        );
        stills[segment.id] = `/motion/${still.name}`;
        report.push(`  stage  ${still.name} ${still.sizeKb} KB`);
      }

      let mp4: { name: string; sizeKb: number } | undefined;
      if (entry.tier === 1) {
        const videoTmp = join(PUBLIC_DIR, `.tmp-${id}.mp4`);
        await renderMedia({
          composition,
          serveUrl,
          codec: "h264",
          outputLocation: videoTmp,
          inputProps: entry.props(theme),
          // Flat institutional surfaces compress extremely well; crf 26 with
          // the slow preset lands these well under the page media budget with
          // no visible banding on the panel fills.
          crf: 26,
          x264Preset: "slow",
          imageFormat: "jpeg",
          jpegQuality: 90,
          pixelFormat: "yuv420p",
          muted: true,
          overwrite: true,
          onProgress: () => undefined,
        });
        mp4 = publish(videoTmp, `${entry.id}-${theme}`, "mp4");
        report.push(`  video  ${mp4.name.padEnd(46)} ${mp4.sizeKb} KB`);
      }

      themed[theme] = {
        poster: `/motion/${poster.name}`,
        mp4: mp4 && `/motion/${mp4.name}`,
        ...(entry.segments ? { stills } : {}),
      };
    }

    manifest.push({
      id: entry.id,
      family: entry.family,
      tier: entry.tier,
      description: entry.description,
      width: entry.width,
      height: entry.height,
      fps: CANVAS.fps,
      durationInFrames: entry.durationInFrames,
      ...(entry.segments ? { segments: entry.segments } : {}),
      light: themed.light!,
      dark: themed.dark!,
    });
    console.log(`✓ ${entry.id}`);
  }

  writeManifest(manifest);
  const retained = JSON.stringify(manifest);
  for (const entry of MOTION_ENTRIES.filter((item) => matches(item.id))) {
    for (const theme of THEME_NAMES) {
      const base = `${entry.id}-${theme}`;
      for (const file of readdirSync(PUBLIC_DIR)) {
        if (
          (file.startsWith(`${base}.`) || file.startsWith(`${base}-stage-`)) &&
          !retained.includes(`/motion/${file}`)
        ) {
          rmSync(join(PUBLIC_DIR, file));
        }
      }
    }
  }
  console.log(`\nManifest written: ${MANIFEST}`);

  console.log(`\n${report.join("\n")}`);
}

/** Writes the complete typed asset manifest. */
const source = (key: string, value: ManifestEntry["light"]) =>
  [
    `    ${key}: {`,
    `      poster: "${value.poster}",`,
    ...(value.mp4 ? [`      mp4: "${value.mp4}",`] : []),
    ...(value.webm ? [`      webm: "${value.webm}",`] : []),
    ...(value.stills ? [`      stills: ${JSON.stringify(value.stills)},`] : []),
    "    },",
  ].join("\n");

function writeManifest(entries: ManifestEntry[]) {
  const body = entries
    .map(
      (e) => `  "${e.id}": {
    id: "${e.id}",
    family: "${e.family}",
    tier: ${e.tier},
    width: ${e.width},
    height: ${e.height},
    fps: ${e.fps},
    durationInFrames: ${e.durationInFrames},
${e.segments ? `    segments: ${JSON.stringify(e.segments)},` : ""}
    description:
      ${JSON.stringify(e.description)},
${source("light", e.light)}
${source("dark", e.dark)}
  },`,
    )
    .join("\n");

  writeFileSync(
    `${MANIFEST}.tmp`,
    `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Written by \`bun run motion:render\` (motion/scripts/render.ts). It is the
 * only thing the website knows about the motion pipeline: filenames, intrinsic
 * dimensions and a text description. No Remotion code is imported here, or
 * anywhere else under src/.
 *
 * Filenames are content-hashed, so \`public/motion/*\` is safe to serve with a
 * one-year immutable cache.
 */

export type MotionSource = {
  /** Poster is always present: it is the complete fallback. */
  poster: string;
  /** Present for tier-1 assets only. Tier 2 ships the still and no video. */
  mp4?: string;
  webm?: string;
  stills?: Record<string, string>;
};

export type MotionAsset = {
  id: string;
  family: string;
  tier: 1 | 2;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  segments?: readonly { id: string; startFrame: number; durationInFrames: number }[];
  /** Text alternative. The DOM around the figure remains authoritative. */
  description: string;
  light: MotionSource;
  dark: MotionSource;
};

export const motionAssets = {
${body}
} as const satisfies Record<string, MotionAsset>;

export type MotionAssetId = keyof typeof motionAssets;
`,
    "utf8",
  );
  renameSync(`${MANIFEST}.tmp`, MANIFEST);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
