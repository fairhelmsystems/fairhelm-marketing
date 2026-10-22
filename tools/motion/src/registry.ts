import type React from "react";
import {
  EvidenceLedRollout,
  rolloutDuration,
  type RolloutVariant,
} from "./compositions/EvidenceLedRollout";
import {
  GovernedQuestionPath,
  governedQuestionPathDuration,
} from "./compositions/GovernedQuestionPath";
import {
  oneCoreDuration,
  OneCoreManySurfaces,
  type SurfacesVariant,
} from "./compositions/OneCoreManySurfaces";
import {
  operatingSignalDuration,
  OperatingSignalToAction,
} from "./compositions/OperatingSignalToAction";
import {
  PHONE_SCREEN,
  PhoneScreen,
  phoneScreenDuration,
  type PhoneVariant,
} from "./compositions/PhoneScreen";
import {
  PRODUCT_SCREEN,
  ProductScreen,
  productScreenDuration,
  type ScreenVariant,
} from "./compositions/ProductScreen";
import { CANVAS, type ThemeName } from "./theme";

/**
 * The single list the Studio, the render script and the website manifest all
 * read. Adding a composition here is the only step needed to make it
 * renderable; nothing downstream keeps its own copy of this table.
 *
 * `tier` follows the motion priority matrix:
 *  - tier 1 ships a video *and* a poster.
 *  - tier 2 ships the poster only, and stays that way until tier 1 has cleared
 *    its performance and human-review gates.
 */
export type MotionEntry = {
  /** Stable key used by the website manifest. */
  id: string;
  family: string;
  tier: 1 | 2;
  /** Frame held as the poster — always the composition's meaningful end state. */
  posterFrame: number;
  durationInFrames: number;
  /**
   * Canvas size. Defaults to 16:9. Compositions that render inside a device
   * bezel must match that bezel's screen cutout instead — 8:5 for the MacBook
   * frame in src/components/site/mockups.tsx — or they letterbox.
   */
  width: number;
  height: number;
  // biome-ignore lint/suspicious/noExplicitAny: each entry carries its own props shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous composition props
  component: React.FC<any>;
  // biome-ignore lint/suspicious/noExplicitAny: see above
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous composition props
  props: (theme: ThemeName) => any;
  /** Accessible description; becomes the aria-label / caption on the site. */
  description: string;
};

const rollout = (variant: RolloutVariant, id: string, tier: 1 | 2, description: string) => ({
  id,
  family: "EvidenceLedRollout",
  tier,
  posterFrame: rolloutDuration(variant) - 1,
  durationInFrames: rolloutDuration(variant),
  width: CANVAS.width,
  height: CANVAS.height,
  component: EvidenceLedRollout,
  props: (theme: ThemeName) => ({ theme, variant }),
  description,
});

const surfaces = (variant: SurfacesVariant, id: string, tier: 1 | 2, description: string) => ({
  id,
  family: "OneCoreManySurfaces",
  tier,
  posterFrame: oneCoreDuration - 1,
  durationInFrames: oneCoreDuration,
  width: CANVAS.width,
  height: CANVAS.height,
  component: OneCoreManySurfaces,
  props: (theme: ThemeName) => ({ theme, variant }),
  description,
});

/**
 * Rendered product screens for the device bezels.
 *
 * Tier matters here: a page that already carries a tier-1 diagram gets its
 * bezel as a *still* (tier 2), so the AI screenshot is still replaced but the
 * page never ships two auto-starting assets. /security/ has no diagram, so its
 * screen is the page's one motion asset.
 */
const screen = (
  variant: ScreenVariant,
  id: string,
  tier: 1 | 2,
  description: string
): MotionEntry => ({
  id,
  family: "ProductScreen",
  tier,
  posterFrame: productScreenDuration - 1,
  durationInFrames: productScreenDuration,
  width: PRODUCT_SCREEN.width,
  height: PRODUCT_SCREEN.height,
  component: ProductScreen,
  props: (theme: ThemeName) => ({ theme, variant }),
  description,
});

const phone = (variant: PhoneVariant, id: string, description: string): MotionEntry => ({
  id,
  family: "PhoneScreen",
  tier: 2,
  posterFrame: phoneScreenDuration - 1,
  durationInFrames: phoneScreenDuration,
  width: PHONE_SCREEN.width,
  height: PHONE_SCREEN.height,
  component: PhoneScreen,
  props: (theme: ThemeName) => ({ theme, variant }),
  description,
});

export const MOTION_ENTRIES: MotionEntry[] = [
  rollout(
    "founding",
    "founding-partner-path",
    1,
    "Four stages of the Founding Institutional Partner pilot: one bottleneck is chosen, a baseline is written down, the current system and SquareCampus run in parallel for 60 to 90 days, and the institution converts, extends or stops against the agreed measure."
  ),
  rollout(
    "rollout",
    "rollout-path",
    1,
    "The six-stage SquareCampus rollout: blueprint, migration clinic, role-based training, parallel validation, staged go-live, and adoption follow-through after handover."
  ),
  {
    id: "governed-question-path",
    family: "GovernedQuestionPath",
    tier: 1,
    posterFrame: governedQuestionPathDuration - 1,
    durationInFrames: governedQuestionPathDuration,
    width: CANVAS.width,
    height: CANVAS.height,
    component: GovernedQuestionPath,
    props: (theme: ThemeName) => ({ theme }),
    description:
      "A leadership question passes through the tenant boundary and the asker's role before any answer is composed. Records outside that scope are refused rather than summarised, the answer is drawn only from what remains, and the query itself is written to the audit timeline.",
  },
  surfaces(
    "architecture",
    "platform-core-surfaces",
    1,
    "Admissions, academics, finance, communication and operations stop exchanging exports with each other and instead act on one shared identity, data and workflow core, so a change made once is already current everywhere else."
  ),
  surfaces(
    "audience",
    "ecosystem-core-surfaces",
    2,
    "Parents, teachers, principals, finance teams and trustees each work from the same institutional record, seeing the part of it their role owns."
  ),
  screen(
    "audit",
    "security-audit-screen",
    1,
    "The SquareCampus audit timeline: a fee concession approved with a recorded reason, an attendance correction logged as an override, a report export recorded against the person who ran it, and a request for records outside the asker's role refused rather than fulfilled."
  ),
  screen(
    "operations",
    "platform-operations-screen",
    2,
    "The SquareCampus daily operations console: fee follow-up drifting past its reminder window with an owner assigned, admissions waiting on document verification, attendance below the policy threshold escalated, and a concession request awaiting trust sign-off."
  ),
  screen(
    "parallel-run",
    "rollout-parallel-run-screen",
    2,
    "Parallel validation during a rollout: the collection register, the daily attendance register and guardian circular delivery reconciled against the institution's existing system, with one admissions discrepancy under review and the agreed success measure tracked."
  ),
  screen(
    "surfaces",
    "ecosystem-surfaces-screen",
    2,
    "One institutional record acted on from every surface: a guardian acknowledging a fee reminder, a teacher marking a register, finance applying an approved concession, transport notifying a route change, and the trust view already current without an export."
  ),
  phone(
    "attendance",
    "phone-attendance-screen",
    "A teacher marking the morning register on a phone, with a third absence in the week raised as an exception that routes to a named owner."
  ),
  phone(
    "fees",
    "phone-fees-screen",
    "A guardian's view of a term fee on a phone: tuition and transport due, an approved concession recorded, and the previous term's receipt available."
  ),
  {
    id: "operating-signal-to-action",
    family: "OperatingSignalToAction",
    tier: 2,
    posterFrame: operatingSignalDuration - 1,
    durationInFrames: operatingSignalDuration,
    width: CANVAS.width,
    height: CANVAS.height,
    component: OperatingSignalToAction,
    props: (theme: ThemeName) => ({ theme }),
    description:
      "A routine record becomes an exception, the exception is routed to a named owner, the owner acts with a recorded reason, and the action is committed to an append-only audit timeline.",
  },
];

export const THEME_NAMES: ThemeName[] = ["light", "dark"];

/** Studio/render composition id for one entry in one theme. */
export const compositionId = (entry: MotionEntry, theme: ThemeName) => `${entry.id}-${theme}`;
