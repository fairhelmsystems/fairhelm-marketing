import { defineConfig } from "@playwright/test";
import { sites, viewports } from "./matrix";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./artifacts/browser/results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 45_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "artifacts/browser/report", open: "never" }],
    ["json", { outputFile: "artifacts/browser/results.json" }],
  ],
  use: {
    browserName: "chromium",
    reducedMotion: "reduce",
    colorScheme: "dark",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: viewports.map(({ name, width, height, touch }) => ({
    name,
    use: { viewport: { width, height }, hasTouch: touch, isMobile: width < 640 },
  })),
  // Not started by --list. CI runs focused contact-flow regressions after the
  // build; the complete visual review matrix remains an explicit opt-in.
  webServer: sites.map((site) => ({
    command: `bun scripts/preview.ts ${site.name}`,
    cwd: "../..",
    url: site.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  })),
});
