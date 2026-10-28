export const dynamic = "force-static";

import { renderRobotsTxt } from "@/lib/robots";

export function GET() {
  return new Response(renderRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
