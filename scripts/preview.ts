import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { runInNewContext } from "node:vm";
const app = process.argv[2];
const targets:Record<string,{host:string;port:number}>={squarecampus:{host:"squarecampus.com",port:3100},blogs:{host:"blogs.squarecampus.com",port:3101},fairhelm:{host:"fairhelmsystems.com",port:3102},legal:{host:"legal.fairhelmsystems.com",port:3103},press:{host:"press.fairhelmsystems.com",port:3104}};
if (!app||!targets[app]) throw new Error("Use squarecampus, fairhelm, blogs, legal or press");
const host=targets[app].host;const port=Number(process.env.PORT||targets[app].port);
const out = resolve(import.meta.dirname, `../apps/${app}/out`);
const edge = runInNewContext(
  `${readFileSync(resolve(import.meta.dirname, "../infra/edge/viewer-request.js"), "utf8")}\nhandler;`
);
Bun.serve({
  port,
  hostname: "127.0.0.1",
  async fetch(request) {
    const url = new URL(request.url);
    const querystring: Record<string, { value: string; multiValue: Array<{ value: string }> }> = {};
    for (const [key, value] of url.searchParams) {
      const k = encodeURIComponent(key),
        v = { value: encodeURIComponent(value) };
      if (!querystring[k]) querystring[k] = { value: v.value, multiValue: [] };
      querystring[k].multiValue.push(v);
    }
    const result = edge({
      request: {
        method: request.method,
        uri: url.pathname,
        headers: { host: { value: host } },
        querystring,
      },
    });
    if (result.statusCode) {
      const location = result.headers.location.value.replace(
        "https://blogs.squarecampus.com",
        "http://localhost:3101"
      ).replace("https://legal.fairhelmsystems.com","http://localhost:3103").replace("https://press.fairhelmsystems.com","http://localhost:3104");
      return new Response(null, { status: result.statusCode, headers: { Location: location } });
    }
    const path = resolve(out, `.${result.uri}`);
    if (!path.startsWith(out + sep)) return new Response("Not found", { status: 404 });
    const file = Bun.file(path);
    if (await file.exists()) return new Response(file);
    return new Response(Bun.file(resolve(out, "404.html")), { status: 404 });
  },
});
console.log(`${app}: http://localhost:${port} (using production edge routing)`);
