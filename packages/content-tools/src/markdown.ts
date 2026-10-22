export function createMarkdownConverter(SITE:string) {
// ---------------------------------------------------------------------------
// HTML → Markdown
// ---------------------------------------------------------------------------

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rarr: "→",
  larr: "←",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  middot: "·",
  copy: "©",
  trade: "™",
};

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code =
        entity[1]?.toLowerCase() === "x"
          ? Number.parseInt(entity.slice(2), 16)
          : Number(entity.slice(1));
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/** Subtrees that never carry page content. */
const SKIP = new Set([
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "video",
  "audio",
  "picture",
  "source",
  "iframe",
  "canvas",
  "header",
  "footer",
  "nav",
  "form",
  "input",
  "select",
  "textarea",
  "label",
  "head",
]);
const VOID = new Set(["br", "hr", "img", "input", "meta", "link", "source", "wbr", "col"]);
const HEADINGS: Record<string, string> = {
  h1: "#",
  h2: "##",
  h3: "###",
  h4: "####",
  h5: "#####",
  h6: "######",
};
const INLINE_CONTAINERS = new Set(["span", "small", "time", "abbr", "cite", "kbd", "sup", "sub"]);
const BLOCKS = new Set([
  "p",
  "div",
  "section",
  "article",
  "aside",
  "main",
  "figure",
  "figcaption",
  "dl",
  "details",
]);

type Attrs = Record<string, string>;

function parseAttrs(raw: string): Attrs {
  const attrs: Attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null = re.exec(raw);
  while (m) {
    attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? "");
    m = re.exec(raw);
  }
  return attrs;
}

/**
 * Is the element part of the desktop representation? Tailwind's bare
 * `hidden` is display:none at every width unless a responsive display class
 * re-enables it; `sm:hidden` and friends hide it from that breakpoint up,
 * which for our purposes means it is the phone-only duplicate.
 */
function visibleOnDesktop(attrs: Attrs): boolean {
  // Collapsed-but-present content opts in with `data-md-include`: closed
  // accordion answers are server-rendered with `hidden` (the browser upgrades
  // them to hidden="until-found"), yet they are page content and the
  // FAQPage structured data declares them.
  if (attrs.hidden !== undefined && attrs["data-md-include"] === undefined) return false;
  if (attrs["aria-hidden"] === "true") return false;
  if (attrs["data-md-skip"] !== undefined) return false;
  const classes = (attrs.class ?? "").split(/\s+/).filter(Boolean);
  if (classes.some((c) => /^(sm|md|lg|xl|2xl):hidden$/.test(c))) return false;
  if (classes.includes("hidden")) {
    return classes.some((c) =>
      /^(sm|md|lg|xl|2xl):(block|flex|grid|inline|inline-block|inline-flex|table|contents)$/.test(c)
    );
  }
  return true;
}

function absolute(href: string): string {
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  if (href.startsWith("#")) return href;
  if (href.startsWith("/")) return `${SITE}${href}`;
  return href;
}

/** Collapse runs of whitespace the way a browser would inside inline flow. */
function inlineText(text: string): string {
  return text.replace(/\s+/g, " ");
}

type TableState = {
  rows: string[][];
  row: string[] | null;
  cell: string[] | null;
  caption: string[] | null;
};

class MarkdownBuilder {
  private blocks: string[] = [];
  private current: string[] = [];
  private listStack: Array<{ ordered: boolean; index: number }> = [];
  private table: TableState | null = null;
  private prefix = "";
  private inPre = false;
  private anchorDepth = 0;
  private anchorHasText = false;
  private headingDepth = 0;

  private buffer(): string[] {
    return this.table?.cell ?? this.table?.caption ?? this.current;
  }

  private flush() {
    const raw = this.current
      .join("")
      .replace(/[ \t]+/g, " ")
      .trim();
    this.current = [];
    const prefix = this.prefix;
    this.prefix = "";
    if (!raw) return;
    // A block that is only a zero-padded ordinal ("01", "02") is a visual
    // step number; the list or heading order already carries it.
    if (/^\d{2}$/.test(raw)) return;
    let text = raw;
    // List items that open with the same ordinal as an inline span.
    if (/^\s*(?:\d+\.|-) $/.test(prefix)) text = text.replace(/^\d{2}\s+(?=\S)/, "");
    this.blocks.push(prefix ? `${prefix}${text}` : text);
  }

  /** Remove trailing whitespace from the working buffer (before a closing marker). */
  private trimEnd() {
    const buffer = this.buffer();
    while (buffer.length > 0) {
      const last = buffer[buffer.length - 1];
      const trimmed = last.replace(/\s+$/, "");
      if (trimmed === last) break;
      buffer.pop();
      if (trimmed) {
        buffer.push(trimmed);
        break;
      }
    }
  }

  /** Inline containers (span, small, time…) that abut text need a separator. */
  private separate(sep = " ") {
    const buffer = this.buffer();
    const last = buffer[buffer.length - 1];
    if (last && !/[\s([]$/.test(last) && !/^\*\*$|^_$|^`$/.test(last)) buffer.push(sep);
  }

  text(raw: string) {
    const text = this.inPre ? raw : inlineText(raw);
    if (this.anchorDepth > 0 && text.trim()) this.anchorHasText = true;
    this.buffer().push(text);
  }

  open(tag: string, attrs: Attrs) {
    if (attrs["data-md-prefix"]) {
      this.separate();
      this.buffer().push(attrs["data-md-prefix"]);
    }
    if (this.table) {
      const t = this.table;
      if (tag === "tr") t.row = [];
      else if (tag === "th" || tag === "td") t.cell = [];
      else if (tag === "caption") t.caption = [];
      else if (tag === "br" && t.cell) t.cell.push(" ");
      else if (tag === "a" && t.cell) t.cell.push("[");
      else if (INLINE_CONTAINERS.has(tag) || BLOCKS.has(tag)) this.separate();
      return;
    }
    if (HEADINGS[tag]) {
      this.flush();
      this.prefix = `${HEADINGS[tag]} `;
      this.headingDepth += 1;
      return;
    }
    const blockLike =
      BLOCKS.has(tag) || (INLINE_CONTAINERS.has(tag) && /\bblock\b/.test(attrs.class ?? ""));
    if (this.anchorDepth > 0 && (blockLike || tag === "br")) {
      // Card-style links: keep the whole card on one line, parts separated.
      if (this.anchorHasText) this.separate(" · ");
      return;
    }
    switch (tag) {
      case "hr":
        this.flush();
        this.blocks.push("---");
        return;
      case "br":
        this.current.push("\n");
        return;
      case "ul":
      case "ol":
        this.flush();
        this.listStack.push({ ordered: tag === "ol", index: 0 });
        return;
      case "li": {
        this.flush();
        const list = this.listStack[this.listStack.length - 1] ?? { ordered: false, index: 0 };
        list.index += 1;
        const indent = "  ".repeat(Math.max(0, this.listStack.length - 1));
        this.prefix = `${indent}${list.ordered ? `${list.index}.` : "-"} `;
        return;
      }
      case "dt":
      case "summary":
        this.flush();
        this.prefix = "**";
        return;
      case "dd":
        this.flush();
        return;
      case "blockquote":
        this.flush();
        this.prefix = "> ";
        return;
      case "pre":
        this.flush();
        this.inPre = true;
        this.current.push("```\n");
        return;
      case "code":
        if (!this.inPre) this.current.push("`");
        return;
      case "strong":
      case "b":
        this.separate();
        this.current.push("**");
        return;
      case "em":
      case "i":
        this.separate();
        this.current.push("_");
        return;
      case "a": {
        const href = attrs.href ?? "";
        this.anchorDepth += 1;
        this.anchorHasText = false;
        if (!href || href.startsWith("#")) return; // in-page anchor: plain text
        if (/\)$/.test(this.current[this.current.length - 1] ?? "")) this.current.push(" · ");
        else this.separate();
        this.current.push("[");
        return;
      }
      case "img": {
        const alt = attrs.alt?.trim();
        if (alt && attrs.src) {
          this.flush();
          this.blocks.push(`![${alt}](${absolute(attrs.src)})`);
        }
        return;
      }
      case "table":
        this.flush();
        this.table = { rows: [], row: null, cell: null, caption: null };
        return;
      default:
        if (INLINE_CONTAINERS.has(tag)) this.separate();
        else if (BLOCKS.has(tag)) this.flush();
        return;
    }
  }

  close(tag: string, attrs: Attrs) {
    if (this.table) {
      const t = this.table;
      if (tag === "th" || tag === "td") {
        if (t.row && t.cell) t.row.push(t.cell.join("").replace(/\s+/g, " ").trim());
        t.cell = null;
      } else if (tag === "tr") {
        if (t.row?.length) t.rows.push(t.row);
        t.row = null;
      } else if (tag === "caption") {
        // Caption text is kept as the sentence that introduces the table.
        const caption = (t.caption ?? []).join("").replace(/\s+/g, " ").trim();
        t.caption = null;
        if (caption) this.blocks.push(caption);
      } else if (tag === "a" && t.cell && attrs.href && !attrs.href.startsWith("#")) {
        t.cell.push(`](${absolute(attrs.href)})`);
      } else if (tag === "table") {
        this.table = null;
        this.emitTable(t.rows);
      }
    } else if (HEADINGS[tag]) {
      this.headingDepth = Math.max(0, this.headingDepth - 1);
      this.flush();
    } else if (this.anchorDepth > 0 && (BLOCKS.has(tag) || tag === "li")) {
      // still inside a card link; nothing to close yet
    } else {
      switch (tag) {
        case "li":
        case "dd":
        case "blockquote":
          this.flush();
          break;
        case "dt":
        case "summary":
          this.trimEnd();
          this.current.push("**");
          this.flush();
          break;
        case "ul":
        case "ol":
          this.flush();
          this.listStack.pop();
          break;
        case "pre":
          this.current.push("\n```");
          this.inPre = false;
          this.flush();
          break;
        case "code":
          if (!this.inPre) this.current.push("`");
          break;
        case "strong":
        case "b":
          this.trimEnd();
          this.current.push("**");
          break;
        case "em":
        case "i":
          this.trimEnd();
          this.current.push("_");
          break;
        case "a": {
          this.anchorDepth = Math.max(0, this.anchorDepth - 1);
          const href = attrs.href ?? "";
          if (!href || href.startsWith("#")) break;
          this.trimEnd();
          this.current.push(`](${absolute(href)})`);
          break;
        }
        default:
          if (BLOCKS.has(tag)) this.flush();
          break;
      }
    }
    if (attrs["data-md-suffix"]) {
      this.trimEnd();
      this.buffer().push(attrs["data-md-suffix"]);
    }
  }

  private emitTable(rows: string[][]) {
    if (rows.length === 0) return;
    const width = Math.max(...rows.map((r) => r.length));
    const pad = (r: string[]) => [...r, ...Array(width - r.length).fill("")];
    const line = (r: string[]) =>
      `| ${pad(r)
        .map((c) => c.replace(/^\d{2}\s+(?=\S)/, "").replace(/\|/g, "\\|"))
        .join(" | ")} |`;
    const [head, ...body] = rows;
    this.blocks.push(
      [line(head), `| ${Array(width).fill("---").join(" | ")} |`, ...body.map(line)].join("\n")
    );
  }

  result(): string {
    this.flush();
    return this.blocks
      .map((b) =>
        b
          .replace(/\*\*\s*\*\*/g, "")
          .replace(/\[\]/g, "")
          .replace(/ +([.,;:])/g, "$1")
          .replace(/ +\]\(/g, "](")
          .replace(/\( /g, "(")
          .replace(/ \)/g, ")")
          .replace(/ {2,}/g, " ")
          .trim()
      )
      .filter((b) => b && b !== "**" && !/^#{1,6}$/.test(b))
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}

/** Tokenize the HTML and drive the builder. Only `<main>` is converted. */
function htmlToMarkdown(html: string): string {
  const builder = new MarkdownBuilder();
  const stack: Array<{ tag: string; attrs: Attrs; skip: boolean }> = [];
  let skipDepth = 0;
  let inMain = false;
  let headingDepth = 0;

  const re =
    /<!--[\s\S]*?-->|<\/([a-zA-Z][^\s>/]*)\s*>|<([a-zA-Z][^\s>/]*)((?:\s+[^\s=>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null = re.exec(html);
  while (m) {
    if (m[0].startsWith("<!--")) {
      // comment
    } else if (m[1]) {
      const tag = m[1].toLowerCase();
      let idx = stack.length - 1;
      while (idx >= 0 && stack[idx].tag !== tag) idx -= 1;
      if (idx >= 0) {
        while (stack.length > idx) {
          const entry = stack.pop();
          if (!entry) break;
          if (HEADINGS[entry.tag]) headingDepth = Math.max(0, headingDepth - 1);
          if (entry.skip) skipDepth -= 1;
          else if (inMain && skipDepth === 0) builder.close(entry.tag, entry.attrs);
          if (entry.tag === "main") inMain = false;
        }
      }
    } else if (m[2]) {
      const tag = m[2].toLowerCase();
      const attrs = parseAttrs(m[3] ?? "");
      const selfClosing = m[4] === "/" || VOID.has(tag);
      // A button inside a heading is an accordion trigger: its text is the
      // question. Elsewhere buttons are controls, not content.
      const skip =
        (tag === "button" && headingDepth === 0) || SKIP.has(tag) || !visibleOnDesktop(attrs);
      if (tag === "main") inMain = true;
      if (HEADINGS[tag] && !selfClosing) headingDepth += 1;
      if (skip) {
        if (!selfClosing) {
          stack.push({ tag, attrs, skip: true });
          skipDepth += 1;
        }
      } else {
        if (inMain && skipDepth === 0) builder.open(tag, attrs);
        if (!selfClosing) stack.push({ tag, attrs, skip: false });
        else if (inMain && skipDepth === 0) builder.close(tag, attrs);
      }
    } else if (m[5] !== undefined) {
      if (inMain && skipDepth === 0) builder.text(decode(m[5]));
    }
    m = re.exec(html);
  }
  return builder.result();
}

function meta(html: string, selector: RegExp): string | undefined {
  const m = selector.exec(html);
  return m ? decode(m[1]) : undefined;
}

function pageToMarkdown(html: string): string {
  const title = meta(html, /<title>([^<]*)<\/title>/i) ?? "";
  const description =
    meta(html, /<meta\s+name="description"\s+content="([^"]*)"/i) ??
    meta(html, /<meta\s+content="([^"]*)"\s+name="description"/i) ??
    "";
  const canonical = meta(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i) ?? "";
  const body = htmlToMarkdown(html);
  const frontMatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical: ${canonical}`,
    `describedby: ${SITE}/llms.txt`,
    "---",
  ].join("\n");
  return `${frontMatter}\n\n${body}\n`;
}


return {htmlToMarkdown,pageToMarkdown};
}
