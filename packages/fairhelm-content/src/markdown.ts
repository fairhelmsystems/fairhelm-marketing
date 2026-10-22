/**
 * A small, dependency-free Markdown reader for the Insights articles.
 *
 * Supports the subset the house style uses: front matter (flat YAML with
 * quoted or bare scalars), `##`/`###` headings, paragraphs, bullet and
 * numbered lists, blockquotes, pipe tables, horizontal rules, fenced code,
 * and inline bold, emphasis, code and links. Anything else falls through as
 * a paragraph, so an article can never silently lose content. The output is
 * a block tree the Prose component renders and the sitemap and JSON-LD read.
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "code"; value: string }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | {
      type: "heading";
      depth: 2 | 3;
      id: string;
      text: string;
      children: Inline[];
    }
  | { type: "paragraph"; children: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; children: Inline[] }
  | { type: "table"; header: Inline[][]; rows: Inline[][][] }
  | { type: "code"; value: string }
  | { type: "rule" };

export type FrontMatter = Record<string, string>;

export function parseFrontMatter(source: string): {
  data: FrontMatter;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: FrontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[kv[1]] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Inline parser: links, bold, emphasis and code, left to right. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let buffer = "";
  const flush = () => {
    if (buffer) out.push({ type: "text", value: buffer });
    buffer = "";
  };
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const code = /^`([^`]+)`/.exec(rest);
    if (code) {
      flush();
      out.push({ type: "code", value: code[1] });
      i += code[0].length;
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest);
    if (link) {
      flush();
      out.push({ type: "link", href: link[2], children: parseInline(link[1]) });
      i += link[0].length;
      continue;
    }
    const strong = /^\*\*([^*]+)\*\*/.exec(rest);
    if (strong) {
      flush();
      out.push({ type: "strong", children: parseInline(strong[1]) });
      i += strong[0].length;
      continue;
    }
    const em = /^(?:\*([^*\n]+)\*|_([^_\n]+)_)/.exec(rest);
    if (em) {
      flush();
      out.push({ type: "em", children: parseInline(em[1] ?? em[2]) });
      i += em[0].length;
      continue;
    }
    buffer += text[i];
    i += 1;
  }
  flush();
  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

const isTableRule = (line: string) =>
  /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line);

export function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  const usedIds = new Map<string, number>();
  let i = 0;

  const uniqueId = (text: string) => {
    const base = slugify(text) || "section";
    const n = usedIds.get(base) ?? 0;
    usedIds.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const heading = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) {
      const text = heading[2].trim();
      blocks.push({
        type: "heading",
        depth: heading[1].length === 2 ? 2 : 3,
        id: uniqueId(text),
        text,
        children: parseInline(text),
      });
      i += 1;
      continue;
    }
    if (/^#\s+/.test(line)) {
      // A stray H1 in the body is demoted: the page renders the title itself.
      const text = line.replace(/^#\s+/, "").trim();
      blocks.push({
        type: "heading",
        depth: 2,
        id: uniqueId(text),
        text,
        children: parseInline(text),
      });
      i += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: "rule" });
      i += 1;
      continue;
    }
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", value: buf.join("\n") });
      continue;
    }
    if (/^\s*>/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", children: parseInline(buf.join(" ")) });
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && isTableRule(lines[i + 1])) {
      const header = splitRow(line).map(parseInline);
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]).map(parseInline));
        i += 1;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && lines[i].trim()) {
        const current = lines[i];
        if (/^\s*([-*+]|\d+[.)])\s+/.test(current)) {
          items.push(current.replace(/^\s*([-*+]|\d+[.)])\s+/, ""));
        } else if (items.length) {
          // Lazy continuation line of the previous item.
          items[items.length - 1] += ` ${current.trim()}`;
        }
        i += 1;
      }
      blocks.push({
        type: "list",
        ordered,
        items: items.map((item) => parseInline(item.trim())),
      });
      continue;
    }
    // Paragraph: consecutive non-blank lines that start no other block.
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|```|\s*>|\s*([-*+]|\d+[.)])\s+|(-{3,}|\*{3,}|_{3,})\s*$)/.test(lines[i]) &&
      !(/^\s*\|.*\|\s*$/.test(lines[i]) && isTableRule(lines[i + 1] ?? ""))
    ) {
      buf.push(lines[i].trim());
      i += 1;
    }
    if (buf.length) {
      blocks.push({ type: "paragraph", children: parseInline(buf.join(" ")) });
    } else {
      i += 1;
    }
  }
  return blocks;
}

export function inlineToText(nodes: Inline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
        case "code":
          return node.value;
        default:
          return inlineToText(node.children);
      }
    })
    .join("");
}

export function blocksToText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "quote":
          return inlineToText(block.children);
        case "list":
          return block.items.map(inlineToText).join(" ");
        case "table":
          return [block.header, ...block.rows]
            .map((row) => row.map(inlineToText).join(" "))
            .join(" ");
        case "code":
          return block.value;
        default:
          return "";
      }
    })
    .join("\n");
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes at a deliberate 210 words per minute. */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 210));
}
