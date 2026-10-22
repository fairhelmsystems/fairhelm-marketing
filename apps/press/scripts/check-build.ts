import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import assert from "node:assert/strict";
const out=resolve(import.meta.dirname,"../out");
assert.ok(existsSync(resolve(out,"index.html")));
const sitemap=readFileSync(resolve(out,"sitemap.xml"),"utf8");
assert.ok(sitemap.includes("press.fairhelmsystems.com"));
console.log("Fairhelm Press: standalone export and canonical sitemap verified.");
