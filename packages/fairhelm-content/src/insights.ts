import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Block,
  blocksToText,
  parseBlocks,
  parseFrontMatter,
  readingMinutes,
  wordCount,
} from "./markdown";

/**
 * Insights: long-form practice notes on data engineering, decision systems,
 * governance and the company, written as Markdown files in this directory.
 * Each file's front matter supplies the metadata; the body is parsed once at
 * build time. Server-only: this module reads the filesystem and must never be
 * imported from a client component.
 *
 * Front matter keys: title, description, date (YYYY-MM-DD), category, lane
 * (site-relative page the article belongs to), laneLabel, and optional
 * readingTimeHint (ignored when the body word count is available).
 */
export type Insight = {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  category: string;
  cover?: string;
  lane: string;
  laneLabel: string;
  words: number;
  minutes: number;
  headings: Array<{ id: string; text: string }>;
  blocks: Block[];
};

export const INSIGHTS_PATH = "/fairhelm/";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "insights");

const REQUIRED = ["title", "description", "date", "category", "lane", "laneLabel"] as const;

function load(file: string): Insight {
  const slug = file.replace(/\.md$/, "");
  const source = readFileSync(join(DIR, file), "utf8");
  const { data, body } = parseFrontMatter(source);
  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`insights/${file}: missing "${key}"`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error(`insights/${file}: date must be YYYY-MM-DD`);
  }
  const blocks = parseBlocks(body);
  const words = wordCount(blocksToText(blocks));
  return {
    slug,
    path: `${INSIGHTS_PATH}${slug}/`,
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    cover: data.cover,
    lane: data.lane,
    laneLabel: data.laneLabel,
    words,
    minutes: readingMinutes(words),
    headings: blocks
      .filter((b) => b.type === "heading" && b.depth === 2)
      .map((b) => (b.type === "heading" ? { id: b.id, text: b.text } : null))
      .filter((h): h is { id: string; text: string } => h !== null),
    blocks,
  };
}

let cache: Insight[] | null = null;

/** Every article, newest first. */
export function getInsights(): Insight[] {
  if (cache) return cache;
  if (!existsSync(DIR)) {
    cache = [];
    return cache;
  }
  cache = readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return cache;
}

export function getInsight(slug: string): Insight | undefined {
  return getInsights().find((post) => post.slug === slug);
}

/** Site-relative routes of every article, for the sitemap and alternates. */
export function insightPaths(): string[] {
  return getInsights().map((post) => post.path);
}

export function insightCategories(): string[] {
  return [...new Set(getInsights().map((post) => post.category))];
}

/** Articles related to a page (same lane), newest first. */
export function insightsForLane(lane: string, limit = 3): Insight[] {
  return getInsights()
    .filter((post) => post.lane === lane)
    .slice(0, limit);
}

export function formatInsightDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
