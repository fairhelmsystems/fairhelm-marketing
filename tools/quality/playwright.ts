import { fileURLToPath } from "node:url";

// Playwright's transformer expects Node; keep Bun for workspace orchestration.
const child = Bun.spawn(
  [
    process.env.NODE_BINARY ?? "node",
    fileURLToPath(import.meta.resolve("@playwright/test/cli")),
    "test",
    ...process.argv.slice(2),
  ],
  {
    cwd: import.meta.dirname,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }
);
process.exitCode = await child.exited;
