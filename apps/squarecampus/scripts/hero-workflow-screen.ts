#!/usr/bin/env bun
/**
 * Generator for the homepage hero screen — the "Admin & Trust Command Centre"
 * shown inside the MacBook. Emits src/components/site/hero-workflow-screen.tsx.
 *
 *   bun scripts/hero-workflow-screen.ts
 *
 * Why a generator: the screen is one inline SVG string (it must be inline so
 * the site's light/dark toggle reaches inside it, and so it paints with the
 * document as the LCP element). A single-line 10 KB string is not something
 * to edit by hand, so the layout lives here as numbers and the string is a
 * build artefact. Edit this file, re-run it, commit both.
 *
 * Design rules the layout below follows (see the file it emits for context):
 *
 *  - The screen renders ~520 px wide inside the laptop on a 1440 px viewport
 *    and ~360 px wide on phones. The viewBox is 1600x1000, so one SVG unit
 *    is ~0.33 px on desktop. NOTHING is set below 30 units (~10-11 px); the
 *    headline is 66, KPI figures 100. If it is not legible in the hero, it is
 *    not on the screen.
 *  - Few, big elements: a rail, a headline, three queue rows, two KPI tiles,
 *    one AEGIS line. The vocabulary matches the rolling log in
 *    hero-product.tsx (Owner set / Routed / Logged).
 *  - Colour comes from the page's own tokens (--foreground, --brand, --teal,
 *    --state-ok, --state-attention, --line ...). Only the screen ground and
 *    card fills are local, switched on `:root[data-theme]` exactly like the
 *    rest of the site so the toggle wins over the OS preference.
 *  - Motion is CSS on opacity/transform only. A staged entrance (rows land in
 *    sequence, KPI marks grow) and one loop (the live dot). Reduced motion
 *    freezes on the completed frame because every keyframe animates FROM a
 *    hidden state TO the element's natural one.
 *  - No filters, no raster, no fonts beyond the site's own.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "components",
  "site",
  "hero-workflow-screen.tsx"
);

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------
const W = 1600;
const H = 1000;
const RAIL = 104;
const X0 = 152; // content left edge
const X1 = 1544; // content right edge
const GAP = 40; // column gap
const RIGHT_W = 520;
const RX1 = X1 - RIGHT_W; // right column left edge
const QX1 = RX1 - GAP; // queue right edge
const TOP = 250; // first row / tile top

// Lucide-style 24-grid strokes, scaled at use.
const ICONS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  receipt: "M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2zM8 10h8M8 14h6",
  ledger: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8",
  sparkles:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
} as const;

type IconName = keyof typeof ICONS;

/** A 24-grid icon centred on (cx, cy) at `size` units, stroked in `stroke`. */
function icon(name: IconName, cx: number, cy: number, size: number, stroke: string, sw = 2.2) {
  const s = size / 24;
  return `<path d="${ICONS[name]}" transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s.toFixed(3)})" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

function text(
  x: number,
  y: number,
  size: number,
  content: string,
  opts: {
    cls?: string;
    fill?: string;
    weight?: number;
    anchor?: "start" | "middle" | "end";
    tracking?: string;
    extra?: string;
  } = {}
) {
  const { cls = "f", fill = "var(--wtxt)", weight, anchor, tracking, extra = "" } = opts;
  const attrs = [
    `x="${n(x)}"`,
    `y="${n(y)}"`,
    `class="${cls}"`,
    `font-size="${size}"`,
    `fill="${fill}"`,
    weight ? `font-weight="${weight}"` : "",
    anchor ? `text-anchor="${anchor}"` : "",
    tracking ? `letter-spacing="${tracking}"` : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
  return `<text ${attrs}>${content}</text>`;
}

/** Mono, upper-case, tracked — the site's eyebrow style. */
function eyebrow(x: number, y: number, content: string, fill = "var(--wmut)", anchor?: "end") {
  return text(x, y, 30, content, {
    cls: "m",
    fill,
    weight: 500,
    tracking: ".14em",
    anchor,
  });
}

/** A rounded status pill whose width follows its label. */
function pill(
  xRight: number,
  cy: number,
  label: string,
  fg: string,
  bg: string,
  opts: { align?: "left" | "right"; dot?: string } = {}
) {
  const { align = "right", dot } = opts;
  const h = 56;
  const w = Math.round(label.length * 22.6 + 48 + (dot ? 28 : 0));
  const x = align === "right" ? xRight - w : xRight;
  const tx = x + w / 2 + (dot ? 12 : 0);
  return (
    `<rect x="${n(x)}" y="${n(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}"/>` +
    (dot
      ? `<circle cx="${n(x + 30)}" cy="${n(cy)}" r="8" fill="${fg}"${dot === "pulse" ? ' class="pulse"' : ""}/>`
      : "") +
    text(tx, cy + 1, 30, label, {
      cls: "m",
      fill: fg,
      weight: 600,
      anchor: "middle",
      tracking: ".12em",
    })
  );
}

// ---------------------------------------------------------------------------
// Content — synthetic; the page carries a "synthetic data" note.
// ---------------------------------------------------------------------------
type Row = {
  icon: IconName | "rupee";
  title: string;
  time: string;
  initials: string;
  owner: string;
  status: string;
  tone: string;
  soft: string;
};

const ROWS: Row[] = [
  {
    icon: "users",
    title: "Attendance · Class 7B",
    time: "09:41",
    initials: "RK",
    owner: "R. Kapoor",
    status: "OWNER SET",
    tone: "var(--state-attention)",
    soft: "var(--state-attention-soft)",
  },
  {
    icon: "rupee",
    title: "Fee reminder · ₹4,200",
    time: "09:44",
    initials: "AC",
    owner: "Accounts desk",
    status: "ROUTED",
    tone: "var(--brand)",
    soft: "var(--brand-soft)",
  },
  {
    icon: "shield",
    title: "Override · Transport fee",
    time: "09:52",
    initials: "PM",
    owner: "P. Mehta",
    status: "LOGGED",
    tone: "var(--state-ok)",
    soft: "var(--state-ok-soft)",
  },
];

// Seven days of attendance, and eight weeks of collections. Values are the
// fraction of the mark's height.
const ATTENDANCE = [0.55, 0.62, 0.58, 0.7, 0.66, 0.78, 0.92];
const COLLECTIONS = [0.3, 0.42, 0.38, 0.55, 0.62, 0.7, 0.66, 0.84];

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------
const LOGO_WEBP_B64 =
  "UklGRqQRAABXRUJQVlA4WAoAAAAQAAAAZwAAZwAAQUxQSN8HAAARsMZs27K3zXXpeWUr+VQ5Vq2ojCmOmVdmTuVRmZlx4DEzL/GYGdIVHHm8peLWikhTVsgKcqMV3AxsPbeu68f3+vue93X+7U9ETAD+f5Wl52PptjFVRGGmukQUZpXYHlYEUC0uOkiwi8Dg4pKLEgBWbEkiOkd+cmLqH0U3/f44ECCOmNz0j5KbHpz45JEdMLEFTNj+PQ+5uOS3IyWcbMuF5UfeN4LExkic8aSlnFU4+0ECuMtzKhxZ8lPnkWyIGPyWleXy8tPbA51py+UV8i+WgI0Qndud5SblmR2AzlON2Mq+awewEf7S2c3KMyMtsLPXdMByCR909rbB2d9qgHh9llqwtB0OL0cqBUw6vM2QpwbBMglHW27Bs11bWmD5NKRS33e0YXo7YPChNoQnwCLEDtNWY5rzL0Hiu55TY/LMXmCJhOMsNyzJD+3XtcffLakhh09FKlFhzNFMhLz53SMgQAyP/dOKaOpDqMp817kBheR1Fw+BBAASQ5ess5XVQPaPkUoQtziKKcv6y/IBsCJqWREDy/8iK1QsfCtY5tZiCjmvOphgInpkInDQqjkrtG1QyM9/6yUAK6JPVgResGLGChXJ7ZLkLZ/YC2DCvIlMNQASiV3e97ilKBBtUsiP3DACpoR5EwGAVR3ARAxdvNaWCtzeIq+7YDswEfVMBA5atfo4gok1ABMxcPLvJPV3a1vk2UsTWBH1rAgetlqW15yQwIo1ACsSR09bC+dqVImoZyJ49J9sRci+a3kCE2sApgrH2Ornty2Rp0dA1LMi0nF/tRW2HbLvObUCK9YAJB/s75bWrMW8TES1/C5b4XlD8gOjFZhYA2K1o59b28aKGBi9x1a455D8wFsqsOKCm+piIhadtc5SuG9JfvCtA2DFQre3iRWx+LwNlsJFI+Sptw+AFRfUOlRE5+JNVoSLh+R1pw2C1YLRnH8HLLpwkxXhRiPkdWcNEj/wrNqnkGcPxehGK+TGFfK6Ubx8xgq1K0LeOr7TvpNWyK1U2JP7jnxpxgq1SX78g7vi5uyQWxvhPIYdxja7RfJfT+5geJ1zdqtz9j+XYdEJd1ntWfPWYQx+8lkr1B6F/J9vDWOnC6baY8tbvvQS7PiJp61QOxTy1q/ujjf+YMZyfQO/dJ4vbK19OXb54LQVak4hP//FZTj6IdnRy6oyFW72rObNcv7eLiC2f+fjVqgZhfzsZ3ZHwivutCJr3lm/G1UJYvhBy7Vy/PolIFgRwzdsthTlFPKWT+4OJgJcPmW5Xn5gGCwBYocVDz1Ru/HbrwESAbAitrt0o6Uoo5CfeN9SMBEAEwZGb33oidpNX1oKoiyJxSO1gwATuok3npbQOXvKUqivCHnzDcPA6InoAhKBzkjtIEiU5kBCbRqsiNqEMd9z+iIMjN5lK3oLyesv7mDRaXf6i0g14MAAUZsGiNIkemXFunc6e915i1Ed9ztZMV/Ivue0QXQu3ejsT9exInolS6Ea/cr4yvHx8W+seP8Rg2CqebfnQt501RB40C3ZyrIVsn53dMLIezZbMefP1SRi0XEfWTk+vnJ8fPwrowMoS6QfW66X117QAevCCnnzzSPAa342Z0XIedVBwC4fn7ZCjjqic/EGy/XyrwfAEgmXOPcoefNp4Dy2Qn7yg7sAL/3ef+z//ujlwIErZ6yQ7fBnkEAsf8RS7tHXIJUgfunsHpXlUaT5bIX8r0/uBez31ZX7Aa/+6awVcnf4c0gJR9pZ7jF7FVjmVkcvdvbvwKoHWyE/v2I/EDzs1myFXN9VET92ds/hiZbIa4HebIU8++2D3rrGVrjH8Ge6Vjv6Wd2aKbAfW1m2rZALTCywc5x7shVSuM/s67pWLyhi96et3my5X3n2BeBCA3GpI/roO8JjIBYciGvkCJVShP1+EAutO+H1d1uKUH+KkHzfQUhYcASAhGr0T9m2ImfNm3PI8tzvRgeQWGqyNevqkAi+4IbfP+2+t0zeeCDAhG7id/39rjVbl4FdYEUAOx561cqJBx56/Mknn9h038SKKw9aCoAV0U0MP2718/uWOPwtVOwCwIroTp2hJUuWLCa6WRH1rPBBR19rALbC8hiY6gAwpYqYl1VKxPypwlm2vFAc/kYHKbGulvOi55SAMUvu6872OPz34wBW7KEgKxIv/5ND7u+uFlnW5JEVwIosQVYJwIu+O+uQC6xpkyV76urdQbBKZC9kqghieHQiW3LB8F2tskP2zC0XLyMAplSXErp3eut3p21lucydLbMjbM/d98XRZRXILhKDy078xF+2WlbIZYsl/NS5lK0IW55d941XgQDx+h9v/K9lK8vFw78DUbDCZ5qwLeWwnE8EieOzZeWQm8z+AVKJhLMcjXRLc36AINZ4TnLT4XeWIQ6Ys5qy5adHgM605eblN4ElAPy1HTM7AJ2n2iBvWFQo4TzHtiQ8hoSiRGe9te2Qp3cByyDhNMe2I/s6JJQmvu+8rcieTChPLHnAeduQ/dDuYDkQu6931sJT9uYXIKFJYoffWaFGnu3a0ogiPLUvEpolq/fNWhEqHZ4eAgYfcqh0ZFkrhpDQNBMO/MF/LZcOj4MJH3e4fJ54E0g0z0Tsdc3tD83MlX16fAgkBr/49FzZrY9PvvtFQCJamRKAxXscWPQFO4AAQCx9wYElX7BsCAATWsuKKJ7qiOKsEtrN4piXxfF/3wBWUDggngkAABAmAJ0BKmgAaAA+bTKSRqQjIaEnOi5IgA2JbER3Htnzt5ryv5FfkB811mbzEafuIznf7L1I+YBzrfMB+wHq2/471Ff4r1AP5Z/n+sL/cj2AP2S9Lv9pvgu/bL9w/gG/Yn/7Xq9+e6WZNXnz7DZV7ZvxVvrHnn/LeZ/HN/wfDDoAfyP+4f9D1SM670x7An8w/sfWA/c72GP1pP3mU0FI+fRUuGdS36um7HMupUPf2/OV5guuqRea+i6mDYhlsL/kHXZAjjyuRxu1Fj7LFH07H/HSuT/7rm5zTdjJZRn/Sw1yBL1Frt9xJ3f5VQclij4M9/+L39DhZ2mgRojbuEiBwydAOR7QeQuaYEa0s8Ds6wAz7lupLiKCmtjzKUqwkjmQaVLsqqZjleXo9J61h36PD6RhbkIfB5vGIIAA/v85vV/4HaHgGYDWDL2CC/OdLD96xlyubmBjcJLZQMJFz3/n04PG/y6Dk7XafvRlu7a2sEUdD/5RUHrHYhEb+0qv87gJBJTJAwbWalZpf3/NXdDcFpraOnQ8O2UrH0+M8jzaqPFWgQh23EX7KkX5mzvw93MUsdULj76+5QZkKZPaE6aTH1Nj+3It1mRTUB+B1RvUgu8SGXBZVVMGZQDogAP7H2fB0aBi2/k7m7dCq72Fw65gWMLeovhbVUdXL0bd2/M/vAz4EU2DHnsD5da82QK2KEFUObePPupqFKLznvyNSdUj3nye4ninHbF0h+rImBUYEY2RKWpeGUjn/pKXw8oN5IS2AuVjFc/mL+WrhT9iFl//e9b/hZe1U9Se4YSnwEaQ0c1kMkXTiRUwbLLz7EXwiZKkURMSXWEyr6MfJRuLcwU1zfNcK1kgEfAoR0kpRy4MEjH/4F4dhIhqrUct0OW97x6wDHXcdh+lvTbawcm13H6LRmfOpLdPcTkLb2Pgkcqt2px6aH653N3J7R1pBLTmY++a1m2FeJc0QjPrmzk7PwQtbCGFG+DSKhUQcXb6J/msMyLGxQlMZ1xEVgeVajJ7gTvlFA45cDsJcPADZJIN2fElK7wnpxf/F95S5wz0l1s9or6XFF38n4s6+6Fs8/dFW7a+r5jt3BEcriBKJpLu0Dsuh1+ymlTTxLh6yO4ICdq3xuvkzxwJ+jUSWqUUJpwcgdeH/b1x5dKUf0cBhIT56NpGkQCU1y1wT//bh5++PoO9xkczn0G5hWvg85uLzI22MzVy1zbIsyhZbZsHxx5+pC3Gc1xU/Q0Qow6Dclv6rYCtKqr+ZlZB6JyKfYecqWELorYKR1OOTtEtdBCvzBBq5L7+IefH3/bp116PViOEuW60mph2gaTrAw2XPC6KSXsjkHktFRRZgZbGyW8UFIZjP9+FR6EOom0Uzzu143SUTsumq/WvSIy9daea4GdHxzaWFYB8ge7mxupSKzlgXsqxr7leFTqI2AxFhsAtlf20lp9lygBFQSLR+4W2C1krHMBXtpQjeP3aFpS3YVRUlMNedq/yNB4DM9y7+XqvMuLsxLQH69ybHMpLiTuLX7VGpIDgrY6LtPdkOdBNgnVyTxvfCgTfMKetuCT1eX+I0Wa18yke5nSsuCeuEmHA/wxnGaQhPPoqPTL6eCic+dUYpUgH7oYXMag2+zV2DErNWUwYy7rfaRxVGW2/6Zw6BYQwqntBJ1WQC/c5nx9zkw63OnEF8LyymjcWjhOZAafKqZnXjLqpfhuHdpuCxwe4KQZDzicBirp6IaW+gyyBud+px9M/XvjUbPnP0zgJhMMgTW/2zYDSocLmrMj5yICjROPqAl+oe9kIcjpIgtYX3EYN4FwiPyA+nwI/2W/LrJUxd6TqAG5bHG8eD928+wKsIdIxqWi9xZ5hbPrD+qXxCiUDxzNLdJX03rPCz9GUCxIEdgTzvczLwu+CibSHR0PxiQXuaRnflBELOUhjXR+AGgiSHsxd1RUo2PHJ/6Ih8Vogs/jScgFpNI0BqTnkVvEpVWAMvWvo97yDPT+gtKAFWNXMzp46Eg8DP03z5ycwK01+/rSiquRE7BfPfBqLXF0l131j/yZDtuH/8LVisWDz1vOs3E4HnftRpvz2NWIExrltj7TqHhJLFm+Ss5YckybqGd2dyQzfn2eQ+bnQBJ0HOWmq9SWYKMeQcDxjyukVcN9KyxPa4VgJrkbnS73nNokkfMig029/XWhUFyK7xofftSU1jrs78tCqpAqkfe0XdpNGRx7gXkoCA1Ufb7v8hklk7FPu3PjoCG576wVOoGluzPmfqotyViHmjzw2weK+WkCJw7aJpMeXcePhPMP/CYc9iM4ng6yThQcOWqmUzJkDe4RqMpgNO85TDLLATBncMxtyjvp2mPQFrAecjK7B4tm0UWlhIX+WA2dte/f81/cmLLBM8KM7X3fZcCqehIe+Ifl3I4DQG+uSJ1WLuJ63SI76kEA9A5KSkL9/De8MImNRzOFMBu1dh3mVPr2GWIuUsv05ALcBMIccbVofTAy+0UaCj0UjN9M47KwYheHmKdZQ+O+67azJARlUSBHEtNEMXH6OF+b4/07Tg/tyKQOPF0gQcwchznJ7/Edo0EkhbzSUm/ZaOC1e2mTO07bSvElSy3naxehGBMZFXDbNctIi0+MUvASplqukEc9Llyijw5Z8PQSj8OT0xhdQPFpAtdt6M6glR/WD/N0sEot79SwZiGPy+A0vaJ2ESQISUdrByOXFgD98LmJNRGGzGcQrH93sdkNsbk+fUCpbqaMG+v6kTxdnOdCPBinWIOc2hq8DEW20oUW4jAVuDQotmNoVNtypYZ3rwqJnaK/M0UtH591grHF6HRV/9M8dSrGjrwzLpZUoA+mBeZFGR+Bvqcsp2zpFi/voNPKXYxwEOv1zMGPsbYzZJwWL8dZ5ynHaaSHyke3fsErhAj3OjKSNn/jeW4OscSMbBYIdeyI1z7yzbI48QcflZgcGdxuhzD505LpmlhTZgTm/GynS+98KS5J6X+THdGvspgaB31GIaJBRjk/Vi9C56Sbx1z6vAd2kSpeIBWAxcxwFqaDOuvb+NlS4qmeLsqqJ1CyfHhXJkeGiaIBHqATbTcKcI82x1hRPiv/d/43SNgVTZ63Vl7xSb4S7vyEnXpKf8m+BAEDGHRLsunW3vFqpictv2uoN21W4AoN8zQ8SdYyT/rKakKrk9JRL1hE2beYHBKD0tWhSyIh9vaTvqBp4/YTEoqp9tjEjmhtLkSRLi/8vmH+LuHj7sxSrwxRquz9rbjJiAkiqLhzBfCa6QC11aFYsG2mBJHQbC/cGlRgAAmkv2hSnwAAA";

function rail() {
  const cx = RAIL / 2;
  const items: IconName[] = ["grid", "bell", "users", "receipt", "ledger", "sparkles"];
  const active = 1;
  let out = `<rect width="${RAIL}" height="${H}" fill="var(--wrail)"/>`;
  out += `<path d="M${RAIL} 0V${H}" stroke="var(--line)" stroke-width="2"/>`;
  // Brand mark: the real SquareCampus logo, embedded as a 104px WebP data
  // URI (~4.5 KB) so the screen stays a single self-contained string.
  out += `<image href="data:image/webp;base64,${LOGO_WEBP_B64}" x="${cx - 28}" y="42" width="56" height="56"/>`;
  items.forEach((name, i) => {
    const cy = 208 + i * 92;
    if (i === active) {
      out += `<rect x="${cx - 38}" y="${cy - 32}" width="76" height="64" rx="18" fill="var(--brand-tint)"/>`;
      out += `<rect x="0" y="${cy - 22}" width="5" height="44" rx="2.5" fill="var(--brand)"/>`;
    }
    out += icon(name, cx, cy, 40, i === active ? "var(--brand)" : "var(--wmut)", 2.2);
  });
  out += `<circle cx="${cx}" cy="${H - 68}" r="30" fill="var(--wcard2)" stroke="var(--line-strong)" stroke-width="2"/>`;
  out += icon("user", cx, H - 68, 32, "var(--wmut)", 2.2);
  return out;
}

function header() {
  let out = "";
  out += eyebrow(X0, 78, "TODAY · WEDNESDAY 9 SEP");
  out += text(X0, 144, 66, "3 exceptions need an owner", {
    cls: "d",
    weight: 600,
    tracking: "-.02em",
  });
  // An illustration must not look like live telemetry: no "LIVE" badge and no
  // pulsing status dot. The pill says what the screen is.
  out += pill(X1, 78, "SAMPLE DATA", "var(--wmut)", "var(--wcard2)");
  return out;
}

function queue() {
  const rowH = 200;
  const gap = 20;
  let out = "";
  out += eyebrow(X0, 212, "EXCEPTION QUEUE");
  out += eyebrow(QX1, 212, "3 OPEN", "var(--state-attention)", "end");
  ROWS.forEach((row, i) => {
    const y = TOP + i * (rowH + gap);
    const cy = y + rowH / 2;
    const delay = (0.18 + i * 0.14).toFixed(2);
    let g = `<g class="up" style="--d:${delay}s">`;
    g += `<rect x="${X0}" y="${y}" width="${QX1 - X0}" height="${rowH}" rx="24" fill="var(--wcard)" stroke="var(--line)" stroke-width="2"/>`;
    // Category icon.
    const icx = X0 + 72;
    g += `<circle cx="${icx}" cy="${cy}" r="42" fill="${row.soft}"/>`;
    g +=
      row.icon === "rupee"
        ? text(icx, cy + 2, 40, "₹", { fill: row.tone, weight: 600, anchor: "middle" })
        : icon(row.icon, icx, cy, 40, row.tone, 2.4);
    // Title + time.
    const tx = X0 + 140;
    g += text(tx, y + 66, 44, row.title, { weight: 600 });
    g += text(QX1 - 28, y + 66, 30, row.time, {
      cls: "m",
      fill: "var(--wmut)",
      anchor: "end",
      tracking: ".06em",
    });
    // Owner chip.
    const oy = y + 136;
    g += `<circle cx="${tx + 30}" cy="${oy}" r="30" fill="var(--wcard2)" stroke="var(--line-strong)" stroke-width="2"/>`;
    g += text(tx + 30, oy + 1, 30, row.initials, {
      cls: "m",
      weight: 600,
      anchor: "middle",
      tracking: ".04em",
    });
    g += text(tx + 76, oy + 1, 32, row.owner, { fill: "var(--wmut)", weight: 500 });
    // Status chip.
    g += pill(QX1 - 28, oy, row.status, row.tone, row.soft);
    g += "</g>";
    out += g;
  });
  return out;
}

function kpi(
  y: number,
  h: number,
  label: string,
  value: string,
  sub: string,
  mark: string,
  delay: string
) {
  let out = `<g class="up" style="--d:${delay}s">`;
  out += `<rect x="${RX1}" y="${y}" width="${RIGHT_W}" height="${h}" rx="24" fill="var(--wcard)" stroke="var(--line)" stroke-width="2"/>`;
  out += eyebrow(RX1 + 32, y + 44, label);
  out += text(RX1 + 30, y + 110, 100, value, {
    cls: "d tab",
    weight: 600,
    tracking: "-.03em",
  });
  out += text(RX1 + 32, y + 172, 30, sub, { fill: "var(--wmut)", weight: 500 });
  out += mark;
  out += "</g>";
  return out;
}

function sparkline(x: number, y: number, w: number, h: number, values: number[], delay: string) {
  const pts = values.map((v, i) => [x + (i * w) / (values.length - 1), y + h - v * h] as const);
  const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${n(px)} ${n(py)}`).join("");
  const [lx, ly] = pts[pts.length - 1];
  return (
    `<g class="gx" style="--d:${delay}s">` +
    `<path d="${d}L${n(lx)} ${n(y + h + 4)}L${n(x)} ${n(y + h + 4)}Z" fill="var(--brand)" opacity=".12"/>` +
    `<path d="${d}" fill="none" stroke="var(--brand)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    "</g>" +
    `<circle cx="${n(lx)}" cy="${n(ly)}" r="11" fill="var(--wcard)" stroke="var(--brand)" stroke-width="7" class="up" style="--d:${(Number(delay) + 0.6).toFixed(2)}s"/>`
  );
}

function bars(x: number, y: number, w: number, h: number, values: number[], delay: string) {
  const gap = 12;
  const bw = (w - gap * (values.length - 1)) / values.length;
  return values
    .map((v, i) => {
      const bh = Math.round(v * h);
      const last = i === values.length - 1;
      return `<rect x="${n(x + i * (bw + gap))}" y="${n(y + h - bh)}" width="${n(bw)}" height="${bh}" rx="6" fill="var(--teal)" opacity="${last ? 1 : 0.42}" class="gy" style="--d:${(Number(delay) + i * 0.05).toFixed(2)}s"/>`;
    })
    .join("");
}

function right() {
  const aegisH = 184;
  const gap = 24;
  const bottom = TOP + 3 * 200 + 2 * 20; // align with the last queue row
  const tileH = (bottom - TOP - aegisH - gap * 2) / 2;
  const y1 = TOP;
  const y2 = TOP + tileH + gap;
  const y3 = y2 + tileH + gap;
  const mx = RX1 + 276; // marks start here, right of the figure
  const mw = RIGHT_W - 276 - 36;

  let out = "";
  out += kpi(
    y1,
    tileH,
    "ATTENDANCE TODAY",
    "94%",
    "1.2 pts above last week",
    sparkline(mx, y1 + 58, mw, 92, ATTENDANCE, "0.55"),
    "0.30"
  );
  out += kpi(
    y2,
    tileH,
    "COLLECTIONS, TERM",
    "81%",
    "₹12.4L of ₹15.3L collected",
    bars(mx, y2 + 50, mw, 100, COLLECTIONS, "0.72"),
    "0.44"
  );

  // AEGIS: a question in the admin's words and a governed answer.
  out += `<g class="up" style="--d:0.58s">`;
  out += `<rect x="${RX1}" y="${y3}" width="${RIGHT_W}" height="${aegisH}" rx="24" fill="var(--wcard)" stroke="var(--line)" stroke-width="2"/>`;
  out += icon("sparkles", RX1 + 48, y3 + 44, 32, "var(--brand)", 2.4);
  out += eyebrow(RX1 + 78, y3 + 46, "AEGIS", "var(--brand)");
  out += text(RX1 + 32, y3 + 92, 32, "Which section slipped this week?", {
    fill: "var(--wmut)",
    weight: 500,
  });
  out += "</g>";
  out += `<g class="up" style="--d:1.0s">`;
  out += `<rect x="${RX1 + 32}" y="${y3 + 120}" width="${RIGHT_W - 64}" height="52" rx="26" fill="var(--brand-tint)" stroke="var(--brand-soft)" stroke-width="2"/>`;
  out += text(RX1 + 58, y3 + 147, 32, "Class 7B · down 4 pts", {
    fill: "var(--brand)",
    weight: 600,
  });
  out += "</g>";
  return out;
}

// ---------------------------------------------------------------------------
// Style — page tokens for colour; only the grounds are local.
// ---------------------------------------------------------------------------
const DARK = "--wbg:#070b14;--wrail:#04070d;--wcard:#0e1526;--wcard2:#161f34";
const LIGHT = "--wbg:#eef2f9;--wrail:#ffffff;--wcard:#ffffff;--wcard2:#eef2fa";

const STYLE = [
  `.sc-wf{${DARK};--wtxt:var(--foreground);--wmut:var(--muted-foreground);display:block;width:100%;height:100%}`,
  `:root[data-theme='light'] .sc-wf{${LIGHT}}`,
  `:root[data-theme='dark'] .sc-wf{${DARK}}`,
  ".sc-wf text{dominant-baseline:middle}",
  ".sc-wf .f{font-family:var(--font-ibm-plex-sans),'IBM Plex Sans',system-ui,sans-serif}",
  ".sc-wf .m{font-family:var(--font-ibm-plex-mono),'IBM Plex Mono',ui-monospace,monospace}",
  ".sc-wf .d{font-family:var(--font-sora),var(--font-ibm-plex-sans),'Sora',system-ui,sans-serif}",
  ".sc-wf .tab{font-variant-numeric:tabular-nums}",
  "@keyframes scwf-up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}",
  ".sc-wf .up{animation:scwf-up .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}",
  "@keyframes scwf-gx{from{transform:scaleX(0)}to{transform:scaleX(1)}}",
  ".sc-wf .gx{transform-box:fill-box;transform-origin:0 50%;animation:scwf-gx 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}",
  "@keyframes scwf-gy{from{transform:scaleY(0)}to{transform:scaleY(1)}}",
  ".sc-wf .gy{transform-box:fill-box;transform-origin:50% 100%;animation:scwf-gy .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}",
  "@keyframes scwf-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.6)}}",
  ".sc-wf .pulse{transform-box:fill-box;transform-origin:50% 50%;animation:scwf-pulse 2.2s ease-in-out infinite}",
  "@media (prefers-reduced-motion:reduce){.sc-wf .up,.sc-wf .gx,.sc-wf .gy,.sc-wf .pulse{animation:none}}",
].join("");

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------
const TITLE = "SquareCampus — admin and trust command centre";
const DESC =
  "The SquareCampus admin and trust command centre. Today's headline: three exceptions need an owner. The queue lists an attendance exception for Class 7B with an owner set, a fee reminder routed to the accounts desk, and a transport-fee override logged to the ledger. Beside it, attendance today at 94 percent, term collections at 81 percent, and an AEGIS answer to which section slipped this week. Figures are illustrative.";

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet" class="sc-wf" role="img" aria-labelledby="scwf-t scwf-d">` +
  `<title id="scwf-t">${TITLE}</title><desc id="scwf-d">${DESC}</desc>` +
  `<style>${STYLE}</style>` +
  `<defs><radialGradient id="scwf-glow" cx="1" cy="0" r="1"><stop offset="0" stop-color="var(--brand)" stop-opacity=".16"/><stop offset="1" stop-color="var(--brand)" stop-opacity="0"/></radialGradient></defs>` +
  `<rect width="${W}" height="${H}" fill="var(--wbg)"/>` +
  `<rect x="${RAIL}" width="${W - RAIL}" height="${H}" fill="url(#scwf-glow)"/>` +
  rail() +
  `<g class="up">${header()}</g>` +
  queue() +
  right() +
  "</svg>";

// Biome prefers the quote style with the fewest escapes; the markup is full of
// double-quoted attributes, so emit a single-quoted literal and stay
// format-clean without a second pass.
const literal = `'${svg.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

const tsx = `/**
 * Hero command-centre screen — the "Admin & Trust Command Centre" inside the
 * MacBook on the homepage.
 *
 * GENERATED by scripts/hero-workflow-screen.ts — edit the generator and run
 * \`bun scripts/hero-workflow-screen.ts\`; do not edit the string by hand.
 *
 * Inlined rather than referenced as <img src="...svg"> for two reasons:
 *
 *  1. THEME. An <img> is an isolated document: it cannot see \`data-theme\` on
 *     the host <html>, so the site's light/dark toggle would not reach it.
 *     Inlined, the markup uses the page's own tokens (--foreground, --brand,
 *     --state-ok ...) and they resolve against the page.
 *
 *  2. LCP. This is the hero's largest element. As an inline node it paints
 *     with the document instead of waiting on a second network round-trip.
 *
 * ${(svg.length / 1024).toFixed(1)} KB raw, no SVG filters, no raster, and every animation is CSS on
 * opacity or transform only. \`prefers-reduced-motion\` freezes it on the
 * completed frame.
 *
 * Both copies of this string ship on the homepage — once as DOM, once inside
 * the RSC flight payload — so every byte here is charged twice.
 */
const MARKUP =
  ${literal};

export function HeroWorkflowScreen({ className }: { className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
`;

writeFileSync(OUT, tsx);
console.log(`wrote ${OUT} (${svg.length} bytes of SVG)`);
