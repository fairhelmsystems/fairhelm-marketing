import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const manifest = JSON.parse(read("package.json"));
assert.equal(manifest.name, "fairhelm-marketing");
assert.ok(manifest.packageManager.startsWith("bun@"));
for (const app of ["squarecampus", "fairhelm", "blogs", "legal", "press"]) {
  const pkg = JSON.parse(read(`apps/${app}/package.json`));
  assert.equal(pkg.dependencies["@fairhelm/ui"], "workspace:*");
  assert.ok(read(`apps/${app}/src/app/globals.css`).includes('@import "@fairhelm/ui/styles.css";'));
  assert.ok(pkg.scripts.build && pkg.scripts.dev && pkg.scripts["check-types"]);
}
function inspect(path: string) {
  for (const file of readdirSync(resolve(root, path), { withFileTypes: true })) {
    const child = `${path}/${file.name}`;
    if (file.isDirectory()) inspect(child);
    else if (/\.tsx?$/.test(file.name)) {
      const source = read(child);
      assert.ok(
        !/from\s+["'](?:@\/|[^"']*apps\/|@fairhelm\/(?:squarecampus|fairhelm)-content)/.test(
          source
        ),
        `Product dependency in company UI: ${child}`
      );
    }
  }
}
inspect("packages/ui/src");
console.log(
  "Workspace verified: company-owned UI, five independent apps, explicit dependency boundaries."
);

// Isolation must hold even when this repository has no parent node_modules.
const { builtinModules } = await import("node:module");
const builtins = new Set([...builtinModules, "bun:test"]);
for (const group of ["apps", "packages", "tools"]) {
  for (const entry of readdirSync(resolve(root, group), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const directory = `${group}/${entry.name}`;
    const pkg = JSON.parse(read(`${directory}/package.json`));
    const declared = new Set([
      pkg.name,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]);
    function checkImports(path: string) {
      for (const file of readdirSync(resolve(root, path), { withFileTypes: true })) {
        if (["node_modules", "out", ".next", ".turbo"].includes(file.name)) continue;
        const child = `${path}/${file.name}`;
        if (file.isDirectory()) checkImports(child);
        else if (/\.(?:tsx?|m?js)$/.test(file.name)) {
          for (const [, specifier] of read(child).matchAll(
            /(?:from\s+|import\s*\(|require\s*\()["']([^"']+)/g
          )) {
            if (/^(?:\.|\/|@\/|node:|bun:)/.test(specifier) || builtins.has(specifier)) continue;
            const name = specifier.startsWith("@")
              ? specifier.split("/").slice(0, 2).join("/")
              : specifier.split("/")[0];
            assert.ok(declared.has(name), `${child}: undeclared dependency ${name}`);
          }
        }
      }
    }
    checkImports(directory);
  }
}
console.log("All workspace imports have declared package dependencies.");
