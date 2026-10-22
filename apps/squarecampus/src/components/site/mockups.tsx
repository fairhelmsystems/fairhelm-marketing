"use client";

import { Network } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { type MotionAsset, motionAssets } from "@/content/motion-assets";
import { useReducedMotion } from "@fairhelm/ui/hooks/useReducedMotion";
import { cn } from "@fairhelm/ui/lib/utils";
import { LaptopDevice, PhoneDevice } from "@fairhelm/ui/components/device-frames";
import { MotionFigure } from "./motion-figure";
import { SyntheticDataNote } from "./synthetic-data-note";
import { TiltStage } from "@fairhelm/ui/components/tilt-stage";

/**
 * Device scenes. The frames are drawn in CSS (see device-frames.tsx); the
 * screen content is a build-time rendered product screen from
 * /public/motion (laptop at 16:10, phone at 390:844 — both match their
 * cutouts exactly, so nothing letterboxes).
 */

function AnimatedScene({
  children,
  className,
  floatPrimary = true,
  floatSecondary = false,
}: {
  children: ReactNode;
  className?: string;
  floatPrimary?: boolean;
  floatSecondary?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Entrance and float loops are pure CSS (`.scene-*` rules in globals.css);
  // this only flips a class once the scene scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion) {
      node.classList.add("is-live");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-live");
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.22,
      }
    );

    observer.observe(node);
    const timeout = setTimeout(() => node.classList.add("is-live"), 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={cn(
        "scene-root device-stage select-none",
        floatPrimary && "scene-float-primary",
        floatSecondary && "scene-float-secondary",
        className
      )}
    >
      <TiltStage>{children}</TiltStage>
    </div>
  );
}

function FrameLabel({ title, align = "between" }: { title: string; align?: "between" | "center" }) {
  return (
    <div
      className={cn(
        "mb-3 flex flex-wrap items-center gap-2 px-1",
        align === "between" ? "justify-between" : "flex-col justify-center"
      )}
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </p>
      {/* Every screen in these frames shows fictional institutions, campuses
          and figures. SyntheticDataNote's contract is that the label is
          visible in the same component as the numbers it qualifies. */}
      <SyntheticDataNote variant="chip" />
    </div>
  );
}

function LaptopFrame({
  title,
  screenSrc,
  screenAlt,
  screenAsset,
  className,
  motionRole,
  priority = false,
}: {
  title: string;
  /** Still for the screen. Omit when `screenAsset` supplies a rendered screen. */
  screenSrc?: string;
  screenAlt: string;
  /**
   * Rendered screen. When present it replaces the still: the poster is a
   * frame of the same composition, so nothing is lost if the video never
   * loads. Rendered at the cutout's own 16:10, so it does not letterbox.
   */
  screenAsset?: MotionAsset;
  className?: string;
  motionRole?: "primary" | "secondary";
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative mx-auto w-full max-w-[56rem]", className)}
      data-scene-item
      data-float={motionRole}
    >
      <FrameLabel title={title} />
      <LaptopDevice>
        {screenAsset ? (
          <MotionFigure asset={screenAsset} bare caption={screenAlt} />
        ) : screenSrc ? (
          <Image
            src={screenSrc}
            alt={screenAlt}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-fill"
            priority={priority}
          />
        ) : null}
      </LaptopDevice>
    </div>
  );
}

function PhoneFrame({
  title,
  screenSrc,
  screenAlt,
  screenAsset,
  className,
  motionRole,
}: {
  title: string;
  /** Still for the screen. Omit when `screenAsset` supplies a rendered screen. */
  screenSrc?: string;
  screenAlt: string;
  /** Rendered screen, at the cutout's own 390:844 so it does not letterbox. */
  screenAsset?: MotionAsset;
  className?: string;
  motionRole?: "primary" | "secondary";
}) {
  return (
    <div
      className={cn("relative w-full max-w-[17rem]", className)}
      data-scene-item
      data-float={motionRole}
    >
      <FrameLabel title={title} align="center" />
      <PhoneDevice>
        {screenAsset ? (
          <MotionFigure asset={screenAsset} bare caption={screenAlt} />
        ) : screenSrc ? (
          <Image src={screenSrc} alt={screenAlt} fill sizes="272px" className="object-fill" />
        ) : null}
      </PhoneDevice>
    </div>
  );
}

/** The phone's overlap position at the laptop's lower-right corner. */
const phoneOverlap = "absolute -bottom-8 right-0 hidden max-w-[13.5rem] md:block lg:-right-3";

/**
 * Scenes with overlapping layers reserve the overhang below the laptop, so
 * the phone and the accent card never run into the next block of content.
 */
const overlapScene = "mx-auto max-w-[60rem] md:mb-8 lg:mb-16";

export function PlatformMockupRow() {
  return (
    <AnimatedScene className={overlapScene}>
      <LaptopFrame
        title="Daily operations"
        screenAsset={motionAssets["platform-operations-screen"]}
        screenAlt="The SquareCampus daily operations console: fee follow-up drifting past its reminder window with an owner assigned, admissions waiting on document verification, attendance below the policy threshold escalated, and a concession request awaiting trust sign-off."
        motionRole="primary"
        priority
      />
      <PhoneFrame
        title="Teacher workspace"
        screenAsset={motionAssets["phone-attendance-screen"]}
        screenAlt="A teacher marking the morning register on a phone, with a third absence in the week raised as an exception that routes to a named owner."
        className={phoneOverlap}
        motionRole="secondary"
      />
      {/* Accent card: overlaps the deck's left end the way the phone overlaps
          the right, hanging below the base so the screen stays uncovered. */}
      <div
        className="surface-panel-strong pointer-events-none absolute -bottom-16 -left-2 hidden max-w-[14rem] rounded-[1.4rem] p-4 lg:block xl:-left-6"
        data-scene-accent
      >
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Network className="size-4 text-(--brand)" />
          Shared data model
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Every surface reads and writes the same institutional record.
        </p>
      </div>
    </AnimatedScene>
  );
}

export function RolloutMockup() {
  return (
    <AnimatedScene className="mx-auto max-w-[56rem]" floatSecondary={false}>
      <LaptopFrame
        title="Parallel validation"
        screenAsset={motionAssets["rollout-parallel-run-screen"]}
        screenAlt="Parallel validation during a rollout: the collection register, the daily attendance register and guardian circular delivery reconciled against the institution's existing system, with one admissions discrepancy under review and the agreed success measure tracked."
      />
    </AnimatedScene>
  );
}

export function EcosystemMockup() {
  return (
    <AnimatedScene className={overlapScene}>
      <LaptopFrame
        title="One institutional record"
        screenAsset={motionAssets["ecosystem-surfaces-screen"]}
        screenAlt="One institutional record acted on from every surface: a guardian acknowledging a fee reminder, a teacher marking a register, finance applying an approved concession, transport notifying a route change, and the trust view already current without an export."
        motionRole="primary"
      />
      <PhoneFrame
        title="Guardian app"
        screenAsset={motionAssets["phone-fees-screen"]}
        screenAlt="A guardian's view of a term fee on a phone: tuition and transport due, an approved concession recorded, and the previous term's receipt available."
        className={phoneOverlap}
        motionRole="secondary"
      />
    </AnimatedScene>
  );
}

export function SecurityMockup() {
  return (
    <AnimatedScene className="mx-auto max-w-[56rem]" floatSecondary={false}>
      {/* The still this replaces asserted "MFA enforced", "Healthy" across five
          control domains, "0 open critical incidents" and a "99.6% success
          rate" — live operational status nobody has audited, in a picture that
          `check-claims.sh` cannot read. The rendered screen shows mechanism
          instead: who acted, in what scope, and that it was written down. */}
      <LaptopFrame
        title="Audit timeline"
        screenAsset={motionAssets["security-audit-screen"]}
        screenAlt="The SquareCampus audit timeline: a fee concession approved with a recorded reason, an attendance correction logged as an override, a report export recorded against the person who ran it, and a request for records outside the asker's role refused."
      />
    </AnimatedScene>
  );
}
