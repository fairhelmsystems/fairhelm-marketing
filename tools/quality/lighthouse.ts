import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type AuditReport, summarize } from "./lighthouse-summary";
import { sites } from "./matrix";

// Explicit invocation only. Browser runs are never part of normal CI/build/test.
const runs = Number(process.env.LIGHTHOUSE_RUNS ?? 3);
if (!Number.isInteger(runs) || runs < 3 || runs > 9)
  throw new Error("LIGHTHOUSE_RUNS must be an integer from 3 to 9");
const node = process.env.NODE_BINARY ?? "node";
const cli = fileURLToPath(import.meta.resolve("lighthouse/cli/index.js"));
const output = resolve(
  import.meta.dirname,
  "artifacts/lighthouse",
  new Date().toISOString().replaceAll(":", "-")
);
await mkdir(output, { recursive: true });
const results = [];
const failures: string[] = [];

for (const site of sites) {
  for (const device of ["mobile", "desktop"] as const) {
    const reports: AuditReport[] = [];
    for (let run = 1; run <= runs; run++) {
      const prefix = resolve(output, `${site.name}-${device}-${run}`);
      const command = [
        node,
        cli,
        `${site.origin}/`,
        "--quiet",
        "--chrome-flags=--headless",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        "--output=html",
        `--output-path=${prefix}`,
        ...(device === "desktop" ? ["--preset=desktop"] : []),
      ];
      console.log(`${site.name} ${device}: Lighthouse run ${run}/${runs}`);
      try {
        const child = Bun.spawn(command, { stdout: "inherit", stderr: "inherit" });
        if ((await child.exited) !== 0) throw new Error("Lighthouse CLI failed");
        const report = JSON.parse(await readFile(`${prefix}.report.json`, "utf8")) as AuditReport;
        summarize([report]);
        reports.push(report);
      } catch (error) {
        failures.push(`${site.name}/${device}/${run}: ${error}`);
      }
    }
    if (reports.length === runs)
      results.push({ site: site.name, device, origin: site.origin, ...summarize(reports) });
  }
}
await writeFile(
  resolve(output, "summary.json"),
  JSON.stringify(
    {
      status: failures.length ? "failed" : "measured",
      generatedAt: new Date().toISOString(),
      note: "Local export lab results. Review raw reports; field Core Web Vitals and CDN effects are not measured.",
      results,
      failures,
    },
    null,
    2
  )
);
console.log(`Reports: ${output}`);
if (failures.length)
  throw new Error(`${failures.length} Lighthouse runs failed; inspect summary.json`);
