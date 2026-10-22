/**
 * Minimal test harness: `test(name, fn)` registers, `runAll()` runs and
 * reports. Uses node:assert for assertions so the suite type-checks without
 * extra type packages and runs under `bun tests/run.ts`.
 */
import assert from "node:assert/strict";

type TestFn = () => void | Promise<void>;
type Registered = { suite: string; name: string; fn: TestFn };

const registry: Registered[] = [];
let currentSuite = "";

export function suite(name: string) {
  currentSuite = name;
}

export function test(name: string, fn: TestFn) {
  registry.push({ suite: currentSuite, name, fn });
}

export { assert };

export async function runAll(): Promise<number> {
  let failed = 0;
  let lastSuite = "";
  for (const entry of registry) {
    if (entry.suite !== lastSuite) {
      console.log(`\n${entry.suite}`);
      lastSuite = entry.suite;
    }
    try {
      await entry.fn();
      console.log(`  ok    ${entry.name}`);
    } catch (error) {
      failed += 1;
      console.log(`  FAIL  ${entry.name}`);
      console.log(`        ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`\n${registry.length - failed} passed, ${failed} failed, ${registry.length} total.`);
  return failed;
}
