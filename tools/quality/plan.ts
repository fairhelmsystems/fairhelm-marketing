import { sites, viewports } from "./matrix";

console.log("Prepared quality matrix (no browser launched, no scores measured):");
for (const site of sites) {
  console.log(`${site.name}: ${site.routes.length} routes at ${site.origin}`);
}
console.log(`Widths: ${viewports.map((viewport) => viewport.width).join(", ")}px`);
console.log(
  "Browser: light/dark captures, overflow, landmarks, navigation, drawers, keyboard, theme."
);
console.log(
  "Lighthouse: three runs per homepage and device; JSON/HTML evidence and median summary."
);
