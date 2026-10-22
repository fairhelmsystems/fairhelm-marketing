/** Daily cache key lets scheduled articles publish on rebuild without requiring a source edit. */
const build = Bun.spawn(["bun", "run", "build:apps"], {
  cwd: import.meta.dirname + "/..",
  env: { ...process.env, CONTENT_BUILD_DATE: new Date().toISOString().slice(0, 10) },
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const code = await build.exited;
if (code) process.exit(code);
const check = Bun.spawn(["bun", "scripts/check-exports.ts"], {
  cwd: import.meta.dirname + "/..",
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const checkCode = await check.exited;
if (checkCode) process.exit(checkCode);
const quality = Bun.spawn(["bun", "scripts/check-page-quality.ts"], {
  cwd: import.meta.dirname + "/..",
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const qualityCode = await quality.exited;
if (qualityCode) process.exit(qualityCode);
const links = Bun.spawn(["bun", "scripts/check-export-links.ts"], {
  cwd: import.meta.dirname + "/..",
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
process.exit(await links.exited);
