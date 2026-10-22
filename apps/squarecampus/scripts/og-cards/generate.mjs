// Build-time generator for per-page Open Graph cards (1200x630).
//
// Renders on-brand typographic cards with the real Sora / IBM Plex fonts via
// next/og's ImageResponse (satori + resvg under the hood — fonts are passed as
// buffers, so no system-font install is needed). Output is committed PNGs in
// public/og; this is run manually when card copy changes, matching the existing
// static-card pattern (public/og/services-card.png stays hand-designed).
//
//   bun scripts/og-cards/generate.mjs [slug]   # one card, or all if omitted
//
// Cards for content-driven routes (search-intent pages, comparisons) are
// derived from the same typed content the pages render from, so their copy
// cannot drift. Palette is the site's dark theme: the site defaults to dark,
// and a share preview should look like the page it opens.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";
import { comparisons } from "../../src/content/comparisons.ts";
import { intentPages } from "../../src/content/intent-pages.ts";

const DIR = dirname(fileURLToPath(import.meta.url));
const font = (f) => readFileSync(join(DIR, "fonts", f));
const fonts = [
  { name: "Sora", data: font("sora-600.woff"), weight: 600, style: "normal" },
  { name: "Sora", data: font("sora-500.woff"), weight: 500, style: "normal" },
  { name: "Plex", data: font("plex-sans-400.woff"), weight: 400, style: "normal" },
  { name: "Plex", data: font("plex-sans-500.woff"), weight: 500, style: "normal" },
  { name: "Mono", data: font("plex-mono-500.woff"), weight: 500, style: "normal" },
];

const logoData = `data:image/png;base64,${readFileSync(join(DIR, "../../public/brand/squarecampus.png")).toString("base64")}`;

// hyperscript: returns the element shape satori expects
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

const C = {
  bg1: "#070B14",
  bg2: "#0E1626",
  ink: "#F3F4F6",
  muted: "#A9B3C4",
  accent: "#6E9AE0",
  kicker: "#8B97AE",
  line: "#1C2637",
  panel: "#111A2B",
};

// decorative connection graph (echoes the site's hero motif), lower-right, faint
const graph = h(
  "svg",
  {
    width: 520,
    height: 360,
    viewBox: "0 0 520 360",
    style: { position: "absolute", right: 0, bottom: 0 },
  },
  h("path", {
    d: "M40 300 L200 210 L330 250 L470 110",
    stroke: C.accent,
    strokeWidth: 2,
    fill: "none",
    opacity: 0.22,
  }),
  h("path", {
    d: "M330 40 L420 40 L500 150 L500 260",
    stroke: C.accent,
    strokeWidth: 1.6,
    fill: "none",
    opacity: 0.16,
  }),
  h("circle", {
    cx: 200,
    cy: 210,
    r: 12,
    fill: C.panel,
    stroke: C.accent,
    strokeWidth: 1.6,
    opacity: 0.5,
  }),
  h("circle", {
    cx: 330,
    cy: 250,
    r: 8,
    fill: C.panel,
    stroke: C.accent,
    strokeWidth: 1.6,
    opacity: 0.5,
  }),
  h("circle", {
    cx: 470,
    cy: 110,
    r: 16,
    fill: C.panel,
    stroke: C.accent,
    strokeWidth: 1.8,
    opacity: 0.5,
  }),
  h("circle", {
    cx: 500,
    cy: 150,
    r: 9,
    fill: C.panel,
    stroke: C.accent,
    strokeWidth: 1.6,
    opacity: 0.35,
  })
);

function card({ label, headline, subhead, path }) {
  const url = `SQUARECAMPUS.COM${path ? `/${path}` : ""}`;
  const headSize = headline.length <= 34 ? 70 : headline.length <= 46 ? 62 : 54;
  return h(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "76px 84px",
        position: "relative",
        backgroundImage: `linear-gradient(135deg, ${C.bg1} 0%, ${C.bg2} 100%)`,
        fontFamily: "Plex",
      },
    },
    graph,
    // top row: kicker + logo
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h(
        "div",
        {
          style: {
            fontFamily: "Mono",
            fontWeight: 500,
            fontSize: "22px",
            letterSpacing: "0.22em",
            color: C.kicker,
            textTransform: "uppercase",
          },
        },
        `SQUARECAMPUS · ${label}`
      ),
      h("img", { src: logoData, width: 84, height: 84 })
    ),
    // middle: headline + subhead
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", maxWidth: "900px" } },
      h(
        "div",
        {
          style: {
            fontFamily: "Sora",
            fontWeight: 600,
            fontSize: `${headSize}px`,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: C.ink,
          },
        },
        headline
      ),
      h(
        "div",
        {
          style: {
            fontFamily: "Plex",
            fontWeight: 400,
            fontSize: "28px",
            lineHeight: 1.4,
            color: C.muted,
            marginTop: "26px",
            maxWidth: "820px",
          },
        },
        subhead
      )
    ),
    // bottom: accent rule + url
    h(
      "div",
      { style: { display: "flex", alignItems: "center" } },
      h("div", {
        style: { width: "44px", height: "3px", backgroundColor: C.accent, marginRight: "20px" },
      }),
      h(
        "div",
        {
          style: {
            fontFamily: "Mono",
            fontWeight: 500,
            fontSize: "20px",
            letterSpacing: "0.14em",
            color: C.muted,
          },
        },
        url
      )
    )
  );
}

async function render(slug, cfg) {
  const img = new ImageResponse(card(cfg), { width: 1200, height: 630, fonts });
  const buf = Buffer.from(await img.arrayBuffer());
  const out = join(DIR, "../../public/og", `${slug}.png`);
  writeFileSync(out, buf);
  console.log(`  ${(buf.length / 1024).toFixed(0).padStart(4)}K  public/og/${slug}.png`);
}

// --- card copy (headlines + subheads condensed from each page's own metadata) ---
export const CARDS = {
  home: {
    label: "SOVEREIGN SCHOOL OS",
    headline: "Run every campus. Govern them as one.",
    subhead:
      "Admissions, academics, fees, communication, and compliance on one governed system of record for Indian school groups.",
    path: "",
  },
  "school-management-system": {
    label: "SCHOOL MANAGEMENT SYSTEM",
    headline: "Built to govern, not just to record.",
    subhead:
      "Admissions, fees, academics, attendance, transport, exams, and parent communication on one system of record.",
    path: "school-management-system",
  },
  "why-squarecampus": {
    label: "WHY SQUARECAMPUS",
    headline: "A School OS, not stitched ERP modules.",
    subhead:
      "One governed system of record, connected workflows, current visibility, and clear accountability.",
    path: "why-squarecampus",
  },
  platform: {
    label: "THE PLATFORM",
    headline: "Every workflow, one connected system.",
    subhead:
      "Admissions, academics, finance, communication, compliance, and operations inside one connected School OS.",
    path: "platform",
  },
  aegis: {
    label: "AEGIS",
    headline: "Ask AEGIS. Don't chase reports.",
    subhead:
      "Governed intelligence for school leaders: role-aware answers, exception detection, and audit-ready decision support.",
    path: "aegis",
  },
  ecosystem: {
    label: "APPS & INTEGRATIONS",
    headline: "An app for every role, on one school record.",
    subhead:
      "Admin console, teacher workspace, and parent and student apps on one record, with scoped integrations.",
    path: "ecosystem",
  },
  security: {
    label: "SECURITY & TRUST",
    headline: "School data, secured and accountable.",
    subhead:
      "Encryption, role-based access, audit trails, and an India-first hosting posture for school data.",
    path: "security",
  },
  rollout: {
    label: "ROLLOUT",
    headline: "From first campus to go-live, guided.",
    subhead:
      "Onboarding, migration, training, parallel runs, and go-live for schools, colleges, and multi-campus institutions.",
    path: "rollout",
  },
  infrastructure: {
    label: "INFRASTRUCTURE",
    headline: "Hosted on Microsoft Azure in India.",
    subhead:
      "Encryption in transit and at rest by design, with availability and recovery documented in writing during security review.",
    path: "infrastructure",
  },
  about: {
    label: "ABOUT",
    headline: "The operating system for Indian education.",
    subhead:
      "Calm, connected, and accountable campus management — operational infrastructure for Indian schools and colleges.",
    path: "about",
  },
  compare: {
    label: "COMPARE",
    headline: "Honest, side-by-side ERP comparisons.",
    subhead:
      "SquareCampus vs Entab CampusCare, Fedena, Teachmint, and other school ERPs — plus a framework to evaluate any system.",
    path: "compare",
  },
  default: {
    label: "SCHOOL OS FOR INDIA",
    headline: "Know what requires attention today.",
    subhead:
      "One system for operations, ownership and leadership visibility. Every exception gets an owner. Every change stays governed.",
    path: "",
  },
  pricing: {
    label: "PRICING",
    headline: "Priced by the institution, not by software complexity.",
    subhead:
      "One annual institutional licence, calculated on student-volume bands and scoped to operational depth. Modules and mobile apps included.",
    path: "pricing",
  },
  "what-is-squarecampus": {
    label: "WHAT IS SQUARECAMPUS",
    headline: "A School Operating System and decision layer.",
    subhead:
      "A system of record stores what happened. A decision layer shows what requires attention, why it matters, who owns it, and what happens next.",
    path: "what-is-squarecampus",
  },
  faq: {
    label: "FAQ",
    headline: "The questions procurement teams ask.",
    subhead:
      "Evaluation, security, rollout, pricing and data exit — answered the way a school buyer asks them.",
    path: "faq",
  },
  "launch-partners": {
    label: "FOUNDING PARTNERS",
    headline: "Shape the School OS against a real bottleneck.",
    subhead:
      "A founder-led pilot for schools, school groups and trusts, with preferential founding terms and a written baseline.",
    path: "launch-partners",
  },
  blog: {
    label: "BLOG",
    headline: "Operating notes for school leadership.",
    subhead:
      "Frameworks on fees, attendance, admissions, exams, governance and rollout — written for principals, trustees and administrators.",
    path: "blog",
  },
  demo: {
    label: "GUIDED DEMO",
    headline: "Bring one real bottleneck. See how it runs.",
    subhead:
      "A guided demo on your own scenario, followed by a written scope. No figures on the site, no pressure in the call.",
    path: "demo",
  },
  contact: {
    label: "CONTACT",
    headline: "Registered office and enquiries.",
    subhead:
      "Fairhelm Systems (OPC) Private Limited, Bangalore. How to reach the team behind SquareCampus.",
    path: "contact",
  },
  ...Object.fromEntries(
    intentPages.map((page) => [
      page.slug,
      { label: "SOLUTIONS", headline: page.h1, subhead: page.metaDescription, path: page.slug },
    ])
  ),
  ...Object.fromEntries(
    comparisons.map((c) => [
      c.slug,
      {
        label: "COMPARE",
        headline: `SquareCampus vs ${c.competitor}`,
        subhead: c.metaDescription,
        path: `compare/${c.slug}`,
      },
    ])
  ),
};

const only = process.argv[2];
const entries = only ? [[only, CARDS[only]]] : Object.entries(CARDS);
for (const [slug, cfg] of entries) {
  if (!cfg) {
    console.error(`no card config for "${slug}"`);
    process.exit(1);
  }
  await render(slug, cfg);
}
