import { mkdir, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve(import.meta.dirname, "..");
const output = process.argv[2] ? resolve(process.argv[2]) : undefined;
if (!output || output === source || output.startsWith(`${source}/`))
  throw new Error("Choose an empty output directory outside the source checkout");
await mkdir(output, { recursive: true });
if ((await readdir(output)).length) throw new Error("Public export directory must be empty");
async function git(args: string[]) {
  const child = Bun.spawn(["git", ...args], { cwd: source, stdout: "pipe", stderr: "pipe" });
  const [bytes, error, code] = await Promise.all([
    new Response(child.stdout).arrayBuffer(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code) throw new Error(error);
  return new Uint8Array(bytes);
}
const decoder = new TextDecoder();
const rootFiles = new Set([
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
  "AGENTS.md",
  "LICENSE",
  "NOTICE",
  "README.md",
  "package.json",
  "bun.lock",
  "bunfig.toml",
  "turbo.json",
  "biome.json",
  "tsconfig.json",
]);
function publishable(path: string) {
  if (path.split("/").some((part) => part === ".." || part === ".git")) return false;
  if (
    /(^|\/)(?:\.env(?!\.example$)[^/]*|.*\.(?:pem|key|p12|pfx|keystore)|id_(?:rsa|ed25519|ecdsa))$/i.test(
      path
    )
  )
    return false;
  return (
    rootFiles.has(path) ||
    /^(?:apps|packages|scripts|docs)\//.test(path) ||
    /^tools\/(?:motion|quality)\//.test(path) ||
    path === "infra/edge/viewer-request.js" ||
    path === ".github/workflows/ci.yml"
  );
}
let count = 0;
for (const entry of decoder
  .decode(await git(["ls-tree", "-rz", "--full-tree", "HEAD"]))
  .split("\0")) {
  if (!entry) continue;
  const [metadata, path] = entry.split("\t");
  if (!publishable(path)) continue;
  const [mode] = metadata.split(" ");
  if (!["100644", "100755"].includes(mode))
    throw new Error(`Unsupported public file mode: ${path}`);
  const target = resolve(output, path);
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(target, await git(["show", `HEAD:${path}`]), {
    mode: mode === "100755" ? 0o755 : 0o644,
  });
  count++;
}
const manifest = await Bun.file(resolve(output, "package.json")).json();
delete manifest.scripts.deploy;
delete manifest.scripts["deploy:plan"];
for (const name of ["aws-cdk", "aws-cdk-lib", "constructs", "@aws-sdk/credential-providers"])
  delete manifest.catalog[name];
await writeFile(resolve(output, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
let readme = await Bun.file(resolve(output, "README.md")).text();
readme = readme.replace(
  "# Fairhelm Marketing\n",
  "# Fairhelm Marketing\n\n> Public source mirror of Fairhelm Systems’ marketing platform. Production deployment tooling, AWS account configuration, credentials and release records stay private.\n"
);
readme = readme.replace(/\n## Deploy by app name[\s\S]*?(?=\n## Ownership and boundaries)/, "\n");
readme = readme.replace(
  /The initial local checkout[^\n]*\n/,
  "This mirror contains the shared design system, five applications and their build and content checks. Changes flow one way from the private company workspace.\n"
);
readme = readme.replace(", and [deployment boundaries](infra/README.md)", "");
readme = readme.replace(
  "The production deploy command defaults to the existing same-origin `/api/contact` intake endpoint. ",
  ""
);
await writeFile(resolve(output, "README.md"), readme);
await writeFile(
  resolve(output, "PUBLIC_MIRROR.json"),
  `${JSON.stringify({ sourceRevision: decoder.decode(await git(["rev-parse", "HEAD"])).trim(), exportPolicy: 1 }, null, 2)}\n`
);
const lock = Bun.spawn(["bun", "install", "--lockfile-only", "--ignore-scripts"], {
  cwd: output,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
if (await lock.exited) throw new Error("Public lockfile regeneration failed");
console.log(
  `Public export: ${count} tracked files; deployment operations and private history excluded.`
);
