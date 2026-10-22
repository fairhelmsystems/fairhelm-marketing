#!/usr/bin/env bun
/**
 * Test runner: `bun tests/run.ts` (also `bun run test`).
 *
 * Every *.test.ts in this directory registers its cases with the harness on
 * import; the harness then runs them and exits non-zero on any failure. These
 * tests need no build: they exercise the canonical config, the generators and
 * the source tree. scripts/check-build.ts covers the built output.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runAll } from "./harness";

const DIR = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".test.ts"))
  .sort();

for (const file of files) {
  await import(join(DIR, file));
}

const failed = await runAll();
process.exit(failed > 0 ? 1 : 0);
