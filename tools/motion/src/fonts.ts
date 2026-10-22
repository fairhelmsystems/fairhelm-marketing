/**
 * Brand typefaces, loaded the same way the website loads them.
 *
 * The site uses Sora for display, IBM Plex Sans for body and IBM Plex Mono
 * for the uppercase operational labels (see src/app/layout.tsx). A rendered
 * composition that used a system font stack would read as a foreign asset the
 * moment it sat next to real page copy, so the same three families are loaded
 * here. `@remotion/google-fonts` registers its own delayRender, so a render
 * cannot start before the faces are ready.
 */
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Sora";

const display = loadDisplay("normal", { weights: ["400", "600"], subsets: ["latin"] });
const sans = loadSans("normal", { weights: ["400", "500"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400"], subsets: ["latin"] });

export const FONT = {
  display: `${display.fontFamily}, system-ui, sans-serif`,
  body: `${sans.fontFamily}, system-ui, sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, monospace`,
} as const;
