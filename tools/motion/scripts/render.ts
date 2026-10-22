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
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { compositionId, MOTION_ENTRIES, THEME_NAMES } from "../src/registry";
import { CANVAS } from "../src/theme";

const here = dirname(fileURLToPath(import.meta.url));
const MOTION_ROOT = resolve(here, "..");
const SITE_ROOT = resolve(MOTION_ROOT, "../../apps/squarecampus");
const PUBLIC_DIR = join(SITE_ROOT, "public", "motion");
const MANIFEST = join(SITE_ROOT, "src", "content", "motion-assets.ts");

const filter = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const matches = (id: string) => filter.length === 0 || filter.some((f) => id.includes(f));

const sha8 = (file: string) =>
  createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);

const kb = (file: string) => Math.round(statSync(file).size / 1024);

/** Rename to a content-hashed name and drop any earlier hash of the same asset. */
function publish(tmp: string, base: string, ext: string) {
  const hash = sha8(tmp);
  const finalName = `${base}.${hash}.${ext}`;
  for (const existing of readdirSync(PUBLIC_DIR)) {
    if (existing.startsWith(`${base}.`) && existing.endsWith(`.${ext}`) && existing !== finalName) {
      rmSync(join(PUBLIC_DIR, existing));
    }
  }
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
  light: { mp4?: string; poster: string };
  dark: { mp4?: string; poster: string };
};

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });

  console.log("Bundling compositions…");
  const serveUrl = await bundle({
    entryPoint: join(MOTION_ROOT, "src", "index.ts"),
    onProgress: () => undefined,
  });

  const manifest: ManifestEntry[] = [];
  const report: string[] = [];

  for (const entry of MOTION_ENTRIES) {
    if (!matches(entry.id)) {
      continue;
    }

    const themed: Partial<Record<"light" | "dark", { mp4?: string; poster: string }>> = {};

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

      themed[theme] = { poster: `/motion/${poster.name}`, mp4: mp4 && `/motion/${mp4.name}` };
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
      light: themed.light!,
      dark: themed.dark!,
    });
    console.log(`✓ ${entry.id}`);
  }

  if (filter.length === 0) {
    writeManifest(manifest);
    console.log(`\nManifest written: ${MANIFEST}`);
  } else {
    console.log("\nPartial render — manifest left untouched. Re-run without a filter to update it.");
  }

  console.log(`\n${report.join("\n")}`);
}

/** Emitted in Biome's own formatting so a render never leaves `bun run check` failing. */
const source = (key: string, value: { poster: string; mp4?: string }) =>
  [
    `    ${key}: {`,
    `      poster: "${value.poster}",`,
    ...(value.mp4 ? [`      mp4: "${value.mp4}",`] : []),
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
    description:
      ${JSON.stringify(e.description)},
${source("light", e.light)}
${source("dark", e.dark)}
  },`
    )
    .join("\n");

  writeFileSync(
    MANIFEST,
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
};

export type MotionAsset = {
  id: string;
  family: string;
  tier: 1 | 2;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
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
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
