import { legalHref } from "@fairhelm/config/urls";
/**
 * Data retention: the public content for /data-retention/ and every retention
 * pointer elsewhere on the site (pricing, FAQ, llms.txt).
 *
 * RULES OF THIS FILE
 * - This is a public repository surface. Legal research, proposed periods,
 *   reviewer identities, sign-off evidence and open legal questions are kept
 *   outside the repository. Nothing researched-but-unreviewed belongs here.
 * - A retention rule reaches the public schedule only through
 *   `publicRetentionSchedule()`, which admits a rule only when its review is
 *   complete for the exact version recorded. A citation is not legal sign-off,
 *   and approval of website wording is not legal review.
 * - No invented periods, deadlines, formats, storage amounts or turnaround
 *   times. No date arithmetic and no deletion-eligibility logic: this site
 *   describes retention, it does not decide it.
 * - Confirmed arrangements and matters awaiting confirmation are kept apart,
 *   and the page renders them apart.
 */

import { company } from "./company";

export const RETENTION_PATH = "/data-retention";

/* -------------------------------------------------------------------------- */
/* Reviewed retention rules                                                    */
/* -------------------------------------------------------------------------- */

/**
 * PENDING_REVIEW — period, applicability or interpretation unresolved.
 * CITED — an authoritative source has been located; awaiting qualified review.
 * VERIFIED — an authorised reviewer approved this exact version, its
 *   applicability and its wording.
 */
export type RuleReviewStatus = "PENDING_REVIEW" | "CITED" | "VERIFIED";

export type RetentionRule = {
  /** Stable identifier, e.g. `in.cbse.affiliation.14-19-b`. */
  id: string;
  /** Bumped on any substantive change; a changed rule needs fresh review. */
  version: number;
  category: string;
  jurisdiction: string;
  /** Who the rule applies to, stated as narrowly as the source requires. */
  applicability: string | null;
  period: string | null;
  trigger: string | null;
  /** Material exception or qualification a reader must see beside the period. */
  qualification: string | null;
  citation: string;
  sourceUrl: string | null;
  commencement: string | null;
  /** ISO date the official source was last read. */
  sourceCheckedOn: string | null;
  status: RuleReviewStatus;
  /**
   * Review record. `reference` points to the sign-off held in an
   * access-controlled system; the reviewer's identity is never stored here.
   */
  review: {
    reference: string;
    reviewedOn: string;
    approvedVersion: number;
  } | null;
  /** Separate, explicit decision to show this rule publicly. */
  approvedForPublicDisplay: boolean;
};

/** The only fields that may reach HTML, JSON-LD, Markdown or llms.txt. */
export type PublicRetentionEntry = {
  id: string;
  category: string;
  jurisdiction: string;
  applicability: string;
  period: string;
  trigger: string | null;
  qualification: string | null;
  citation: string;
  sourceUrl: string;
};

/**
 * The authoring source for the public schedule. Empty by design: no rule has
 * completed qualified legal review, so none may be published.
 */
export const retentionRules: readonly RetentionRule[] = [];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Why a rule cannot be published, or `null` when it can. */
export function publicationBlocker(rule: RetentionRule): string | null {
  if (rule.status !== "VERIFIED") return `status is ${rule.status}`;
  if (!rule.review) return "no review record";
  if (!rule.review.reference.trim()) return "review reference missing";
  if (!ISO_DATE.test(rule.review.reviewedOn)) return "review date missing or malformed";
  if (rule.review.approvedVersion !== rule.version) {
    return `review approved version ${rule.review.approvedVersion}, rule is version ${rule.version}`;
  }
  if (!rule.approvedForPublicDisplay) return "not approved for public display";
  if (!rule.sourceUrl?.startsWith("https://")) return "official source URL missing";
  if (!rule.applicability?.trim()) return "applicability missing";
  if (!rule.jurisdiction.trim()) return "jurisdiction missing";
  if (!rule.period?.trim()) return "period missing";
  return null;
}

/** Project publishable rules onto public fields only. */
export function publicRetentionSchedule(
  rules: readonly RetentionRule[] = retentionRules
): PublicRetentionEntry[] {
  return rules
    .filter((rule) => publicationBlocker(rule) === null)
    .map((rule) => ({
      id: rule.id,
      category: rule.category,
      jurisdiction: rule.jurisdiction,
      applicability: rule.applicability as string,
      period: rule.period as string,
      trigger: rule.trigger,
      qualification: rule.qualification,
      citation: rule.citation,
      sourceUrl: rule.sourceUrl as string,
    }));
}

/* -------------------------------------------------------------------------- */
/* Shared pointer                                                              */
/* -------------------------------------------------------------------------- */

/** Rendered verbatim on every plan presentation and in llms.txt. */
export const retentionPointer = {
  text: "Your plan does not determine your legal retention obligations. Storage and archive arrangements are specified in your proposal and order form.",
  linkLabel: "How retention works",
  href: legalHref("squarecampus", `${RETENTION_PATH}/`),
} as const;

/* -------------------------------------------------------------------------- */
/* Source references                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Official sources a reader can consult. Listed for reference only: no
 * period, interpretation or applicability conclusion is drawn from them here.
 */
export type SourceReference = {
  id: string;
  title: string;
  issuer: string;
  /** Neutral description of what the instrument covers. */
  covers: string;
  url: string;
  host: string;
  checkedOn: string;
};

export const sourceReferences: readonly SourceReference[] = [
  {
    id: "dpdp-act-2023",
    title: "Digital Personal Data Protection Act, 2023",
    issuer: "Ministry of Electronics and Information Technology",
    covers: "The Act governing the processing of digital personal data in India.",
    url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf",
    host: "meity.gov.in",
    checkedOn: "2026-09-28",
  },
  {
    id: "dpdp-rules-2025",
    title: "Digital Personal Data Protection Rules, 2025",
    issuer: "Ministry of Electronics and Information Technology · G.S.R. 846(E)",
    covers:
      "Rules made under the Act, including provisions on retention and erasure. Different rules come into force on different dates.",
    url: "https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf",
    host: "meity.gov.in",
    checkedOn: "2026-09-28",
  },
  {
    id: "cbse-affiliation-bye-laws",
    title: "CBSE Affiliation Bye-Laws, 2018 — Chapter 14",
    issuer: "Central Board of Secondary Education",
    covers:
      "Conditions for CBSE-affiliated schools, including the records and documents a school is to maintain.",
    url: "https://www.cbse.gov.in/cbsenew/affbye//Chapter%2014.pdf",
    host: "cbse.gov.in",
    checkedOn: "2026-09-28",
  },
] as const;

export function sourceReference(id: SourceReference["id"]): SourceReference {
  const ref = sourceReferences.find((r) => r.id === id);
  if (!ref) throw new Error(`retention.ts: unknown source reference "${id}"`);
  return ref;
}

/* -------------------------------------------------------------------------- */
/* Page copy                                                                   */
/* -------------------------------------------------------------------------- */

export const retentionPage = {
  title: "Data Retention",
  metaTitle: "Data Retention",
  description:
    "Who is responsible for retaining institutional data, what determines how long records are kept, and what happens to data before, during and after a SquareCampus contract.",

  opening: {
    heading: "Records outlive the people who made them.",
    paragraphs: [
      "A transfer certificate is requested a decade after a student leaves. An inspector asks for last year's answer sheets. An auditor asks about a fee concession granted years ago. A parent asks the school to erase their child's data, and the school has to decide whether it can.",
      "Each of these questions lands on the institution, not on its software vendor. The institution must keep what the law requires, erase what it no longer needs, and be able to show which is which. That makes retention a governance decision rather than a storage setting, and it belongs in writing before an institution signs with any vendor, including us.",
    ],
  },

  posture: {
    heading: "Our position",
    lead: "We will not tell you that software makes an institution compliant. What we can do is be exact about what exists today and what does not.",
    points: [
      "The institution owns its records. SquareCampus processes institutional data on the institution's documented instructions, under the Data Processing Addendum.",
      "Retention deadlines, preservation holds that block erasure, and consent withdrawal are being built into the platform's data layer. None of them is available for institutional data yet, and this page will say when that changes.",
      "Exit terms — what is returned, in what form, when, and what is deleted — are agreed in writing rather than left to goodwill.",
    ],
  },

  roles: {
    heading: "Who is responsible for what",
    institution:
      "For the records an institution keeps in SquareCampus — students, guardians, staff, admissions, attendance, examinations, fees — the institution decides why and how the data is processed and for how long it is kept. In the language of the DPDP Act, the institution is the Data Fiduciary.",
    processor: `${company.legalNameDisplay} processes that data on the institution's documented instructions, as its Data Processor, under the Data Processing Addendum.`,
    ownData: `For its own website and business records — including enquiries submitted through this website — ${company.legalNameDisplay} is the Data Fiduciary.`,
  },

  determination: {
    heading: "How retention is determined",
    paragraphs: [
      "How long a record must be kept depends on the kind of record, the board the school is affiliated to, the state it operates in, and the institution's legal form and tax status. Requirements can attach to admission and withdrawal registers, attendance records, examination and assessment records, staff records and books of account, among others.",
      "More than one obligation can apply to the same record, and they do not rank themselves. When one purpose ends, another obligation may still require the record to be kept.",
      "A statutory requirement to preserve a record is separate from the storage in a subscription. Your plan does not determine your legal retention obligations: storage and archive arrangements are commercial terms, specified in your proposal and order form, and they neither shorten nor extend what the law requires.",
    ],
  },

  schedule: {
    heading: "Reviewed retention schedule",
    emptyNotice:
      "We have not yet published a reviewed retention schedule. Applicable retention requirements depend on the institution and the records concerned.",
    columns: ["Record category", "Applies to", "Period", "Trigger", "Qualification", "Source"],
  },

  erasure: {
    heading: "Purpose, consent and preservation",
    paragraphs: [
      "The end of a purpose, the withdrawal of consent and a duty to preserve a record are separate questions. Whether a record may be erased depends on whether any law or other obligation still requires it to be kept.",
      "The end of one obligation does not by itself permit deletion while another still applies, and the absence of a known period is never permission to erase. For institutional records these are the institution's decisions; SquareCampus acts on its documented instructions.",
    ],
  },

  preservation: {
    heading: "Preservation requests",
    paragraphs: [
      `An authorised contact at an institution can ask us in writing to preserve specified records — for example because of litigation, an inspection or a regulator's request. Write to ${company.email.support}, identify the records and the reason, and say who is authorising the request.`,
      "We assess each request against the institution's agreement, the instructions we hold and applicable requirements, and reply in writing. SquareCampus does not offer a self-service preservation control, and a request is not in effect until we have confirmed it.",
    ],
  },

  exit: {
    heading: "Contract end, export and deletion",
    paragraphs: [
      "The Data Processing Addendum sets what happens when a subscription ends or on written request: SquareCampus deletes or anonymises personal data processed on the institution's behalf, or returns it in a reasonable format where export functionality is agreed. It may retain data where required by law, for dispute resolution or for backup purposes, after which the data is deleted or anonymised.",
      "Export scope, available formats, timing, responsibilities and any charges are agreed in the order form. We do not publish a standard export format or turnaround time, and an institution-wide export is not a self-service feature today.",
      "Ending a contract, changing plan or exceeding a storage allowance does not change what the law requires an institution to keep.",
    ],
  },

  backups: {
    heading: "Backups and other copies",
    paragraphs: [
      "Backups exist to recover from failure, not to keep records for longer. Data deleted from live systems can remain in backups until those backups expire on their cycle.",
      "Backup retention periods are documented in writing during security review rather than published on this page.",
    ],
  },

  enquiries: {
    heading: "Enquiries submitted through this website",
    paragraphs: [
      "When you submit the demo or contact form, we store the details you enter together with your IP address and browser details, pass the enquiry to our customer-relationship system, and notify our team by email. Records used to limit abuse of the form are set to expire automatically.",
      "A retention period for website enquiries, and for their copies in our customer-relationship system, email and logs, has not yet been set.",
    ],
    requests: `Requests concerning personal data submitted through this website may be sent to ${company.grievance.email}. We assess each request against applicable requirements and any continuing need to retain the information.`,
  },

  requests: {
    heading: "Making a request",
    items: [
      {
        who: "Students, parents, guardians and staff",
        body: "Your institution decides how your records are kept. Raise requests about them with the institution first; we support it as its Data Processor.",
      },
      {
        who: "Institutions",
        body: `Requests about institutional data, exports and preservation go to ${company.email.support}.`,
      },
      {
        who: "Website enquiries",
        body: `Requests about personal data submitted through this website go to the ${company.grievance.name}, at ${company.grievance.email}.`,
      },
    ],
  },

  status: {
    heading: "Where things stand",
    confirmed: [
      "The institution is the Data Fiduciary for its records; SquareCampus processes them on its instructions under the Data Processing Addendum.",
      "Contract-end return, deletion and anonymisation follow the Data Processing Addendum.",
      "Export scope, formats, timing and charges are agreed in the order form.",
      "Website enquiries are stored, passed to our customer-relationship system and notified to our team by email.",
      "Preservation and data requests are made in writing to the contacts on this page and assessed individually.",
    ],
    awaiting: [
      "A reviewed retention schedule for institutional records.",
      "A retention period for website enquiries and their copies.",
      "Retention deadlines, preservation holds and consent withdrawal as product capabilities for institutional data.",
      "Self-service institution-wide export.",
    ],
  },

  references: {
    heading: "Source references",
    note: "Official sources relevant to retention for schools in India, listed for reference. Listing a source here is not a statement of how it applies to any institution.",
  },

  disclaimer:
    "This page explains SquareCampus’s approach to data retention and the arrangements described here. It is not legal advice. Institutions should confirm their obligations with their own advisors.",
} as const;

/**
 * The date a person last reviewed this page's content in full. Set by hand
 * against a real review — never computed, never the build date. `null` until
 * the first dated review of the final page; publication waits for it.
 */
export const retentionContentReview: { reviewedOn: string | null } = {
  reviewedOn: null,
};

/* -------------------------------------------------------------------------- */
/* Reconciled wording reused elsewhere                                         */
/* -------------------------------------------------------------------------- */

/** Replaces exit and capability claims that were stronger than the evidence. */
export const retentionReuse = {
  faqCompliance:
    "SquareCampus is designed with privacy-by-default principles and to support institutions' obligations under the IT Act 2000, the DPDP Act and education-sector requirements. Retention, preservation and export are handled as set out on our Data Retention page, which separates what is available today from what is still being built.",
  faqExit:
    "Your institution owns its data. What happens at the end of a contract is set by your agreement and the Data Processing Addendum: data is returned where export is agreed, or deleted or anonymised, subject to what the law requires to be kept. Export scope, formats, timing and any charges are agreed in the order form.",
  exitShort:
    "Export and deletion at the end of a contract are agreed in writing in your order form and the Data Processing Addendum.",
} as const;
