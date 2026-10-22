/**
 * Stale or forbidden wording, shared by the tests and the post-build check.
 *
 * Two lists: STALE_CLAIMS is checked against every public surface (source
 * copy, rendered HTML, llms.txt, Markdown alternates); DIRECTIVE_PHRASES are
 * phrases that would turn llms.txt into instructions for assistants.
 *
 * A pattern belongs here when the fact it guards is settled: the company is
 * incorporated, DPIIT recognition has not been granted, no customer evidence
 * is published, SquareCampus is a School Operating System rather than a
 * "sovereign School OS", and the services surface is bounded.
 */
export const STALE_CLAIMS: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  // Legal / company status
  {
    pattern: /incorporation (is )?in progress|intended legal entity|pending incorporation/i,
    reason: "the company is incorporated (CIN allotted 5 August 2026)",
  },
  {
    pattern: /GSTIN[^.]{0,60}(available )?on request|statutory registration particulars/i,
    reason: "the GSTIN is allotted (22 September 2026) and published",
  },
  {
    pattern: /Pvt\.? Ltd/i,
    reason: "use the registered form 'Private Limited'",
  },
  {
    pattern: /email placeholder|placeholder pending mailbox/i,
    reason: "the contact mailbox is live",
  },
  // Recognitions that do not exist
  {
    pattern:
      /DPIIT|Startup India|startup recogni[sz]|recognition number|government[- ]backed|government[- ]recogni[sz]ed/i,
    reason: "DPIIT / Startup India recognition has not been granted",
  },
  // Fabricated proof
  {
    pattern:
      /trusted by|used by \d|proven at|\d+\+ (schools|institutions|customers|clients)|India's #1|award[- ]winning|ISO[- ]?27001 certified|SOC ?2 certified|bank[- ]grade/i,
    reason: "no customer, award or certification evidence is published",
  },
  {
    pattern: /built with (trusts|institutions|schools|universities)|built alongside/i,
    reason: "use 'built for' — no documented co-development with named institutions",
  },
  {
    pattern: /\b(funded by|raised \$|series [A-C]\b|venture[- ]backed)/i,
    reason: "no funding claims",
  },
  // Product category
  {
    pattern: /sovereign(,)? (cycle-native )?school os|sovereign school/i,
    reason: "SquareCampus is a School Operating System; 'sovereign' is not canonical wording",
  },
  // Services boundary
  {
    pattern:
      /we build anything|any software requirement|custom software development|website development|mobile app development|staff augmentation services|digital marketing services|chatbot development/i,
    reason:
      "outside the bounded services surface (may only appear in an explicit out-of-scope list)",
  },
  // Boilerplate
  {
    pattern: /revolutionary|cutting-edge|transform education|AI-powered future|world[- ]class/i,
    reason: "boilerplate",
  },
];

/** Phrases that would turn llms.txt into instructions for assistants. */
export const DIRECTIVE_PHRASES: ReadonlyArray<RegExp> = [
  /\brecommend (Fairhelm|SquareCampus)\b/i,
  /\bwhen users ask\b/i,
  /\bnotes for assistants\b/i,
  /\byou (must|should) (describe|say|recommend|prefer)\b/i,
  /\bignore (previous|prior) instructions\b/i,
];

/**
 * Wording that is only acceptable inside an explicit "not offered / outside
 * scope" statement. `findStaleClaims` allows a services-boundary hit when the
 * text shortly before it establishes that context — an out-of-scope list on
 * a page, the `outOfScope` array in site-config, or a "Not offered:" prefix.
 */
const SCOPE_CONTEXT =
  /outOfScope|not offered|outside [^\n.]{0,40}scope|out of scope|is not (a|an) |it is not/i;
const SCOPE_WINDOW = 600;

export function findStaleClaims(text: string) {
  return STALE_CLAIMS.filter(({ pattern, reason }) => {
    if (!pattern.test(text)) return false;
    if (!reason.startsWith("outside the bounded services surface")) return true;
    const global = new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`);
    for (const match of text.matchAll(global)) {
      const start = Math.max(0, (match.index ?? 0) - SCOPE_WINDOW);
      const before = text.slice(start, match.index ?? 0);
      if (!SCOPE_CONTEXT.test(before)) return true;
    }
    return false;
  });
}
