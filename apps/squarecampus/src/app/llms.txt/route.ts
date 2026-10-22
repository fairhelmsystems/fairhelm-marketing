export const dynamic = "force-static";

import { renderLlmsTxt } from "@/content/llms";

/**
 * /llms.txt — generated from content/llms.ts and content/commercial.ts at
 * build time, so the machine-readable summary states the same commercial
 * facts as the pages it points at. Served as plain text with no JavaScript
 * and no authentication, exactly like robots.txt.
 */
export function GET() {
  return new Response(renderLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
