export const dynamic = "force-static";

import { renderLlmsTxt } from "@/content/llms";

/**
 * /llms.txt — generated from content/llms.ts and lib/site-config.ts at build
 * time, so the machine-readable summary states the same company facts as the
 * pages it points at. Served as plain text, exactly like robots.txt.
 */
export function GET() {
  return new Response(renderLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
