import type { ElementType, ReactNode } from "react";
import { cn } from "@fairhelm/ui/lib/utils";
import { SectionHeader } from "@fairhelm/ui/components/marketing";
import { ResponsiveDisclosure } from "@fairhelm/ui/components/responsive-disclosure";

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  /** See SectionHeader: `above` only for hash-checked legal documents. */
  eyebrowPlacement?: "lead-in" | "above";
  title?: string;
  /**
   * Heading level for `title`. Defaults to h2, because most sections are
   * sections. A page whose H1 *is* its first section header must pass
   * `as="h1"` — otherwise the page ships with no H1 at all.
   */
  as?: ElementType;
  /** Page titles use the larger display step; section titles the section step. */
  titleSize?: "page" | "section";
  body?: string;
  /** Hide the body copy on phones (used when the section content is behind a MobileExpand). */
  compactBody?: boolean;
  align?: "left" | "center";
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Phone summary for a whole secondary section; full content remains in one DOM tree. */
  mobileDisclosure?: string;
}

export function SectionShell({
  id,
  eyebrow,
  eyebrowPlacement,
  title,
  as,
  titleSize = "section",
  body,
  compactBody = false,
  align = "left",
  children,
  className,
  contentClassName,
  mobileDisclosure,
}: SectionShellProps) {
  const content = (
    <>
      <SectionHeader
        eyebrow={eyebrow}
        eyebrowPlacement={eyebrowPlacement}
        title={title}
        as={as}
        size={titleSize}
        body={body}
        align={align}
        className="mb-6 sm:mb-10 lg:mb-14"
        bodyClassName={cn(compactBody && "hidden sm:block")}
      />
      <div className={contentClassName}>{children}</div>
    </>
  );
  return (
    <section
      id={id}
      className={cn(
        "relative px-4 py-9 sm:px-6 sm:py-16 lg:px-8 lg:py-24",
        mobileDisclosure && "responsive-section",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">
        {mobileDisclosure ? (
          <ResponsiveDisclosure label={mobileDisclosure}>{content}</ResponsiveDisclosure>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
