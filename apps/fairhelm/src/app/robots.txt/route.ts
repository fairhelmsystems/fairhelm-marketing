export const dynamic = "force-static";

import { absoluteUrl } from "@/lib/site-config";

/**
 * We want to be crawled, indexed and cited. With a small team, discovery via
 * search engines and AI answer engines is leverage, not a risk — so nothing
 * is disallowed, and the agents that default to blocked unless a site opts in
 * are named explicitly. No speculative directives: allow, the canonical
 * sitemap, and a pointer to the machine-readable summary.
 */
const welcomedAgents = [
  "*",
  // Search engines
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "YandexBot",
  "Applebot",
  // AI training / answer / recommendation engines
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "CCBot",
];

export function renderRobotsTxt(): string {
  const rules = welcomedAgents.map((agent) => `User-Agent: ${agent}\nAllow: /`).join("\n\n");
  return [
    rules,
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    `# Machine-readable company summary: ${absoluteUrl("/llms.txt")}`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(renderRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
