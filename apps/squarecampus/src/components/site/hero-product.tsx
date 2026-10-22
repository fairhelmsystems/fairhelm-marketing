import { LaptopDevice } from "@fairhelm/ui/components/device-frames";
import { HeroWorkflowScreen } from "./hero-workflow-screen";
import { SyntheticDataNote } from "./synthetic-data-note";
import { TiltStage } from "@fairhelm/ui/components/tilt-stage";

/**
 * Homepage hero product composition.
 *
 * Deliberately a Server Component and deliberately in normal document flow —
 * the previous version floated the phone and the AEGIS card with `absolute`,
 * which overlapped the command-centre screenshot between 1024px and 1279px and
 * reserved a large empty band beneath the hero.
 *
 * Composition rules:
 *  - The Admin / Trust Command Centre is always the dominant visual.
 *  - The laptop frame appears only at `lg` (`collapsible`). Below that it
 *    costs a quarter of the width to aluminium, which is what made the
 *    dashboard illegible on phones — so small screens get the screen in a
 *    plain rounded frame at full width instead.
 *  - One screen, no competing devices (audit SC-010): the phone and the
 *    animated AEGIS feed that used to sit beside it are gone, replaced by
 *    three annotations in body-size text.
 *  - One inline SVG renders the screen at every breakpoint; only the frame
 *    around it changes. Being inline is what lets the site's light/dark
 *    toggle reach inside it — an <img> is an isolated document and cannot
 *    see `data-theme` on the host <html>.
 *  - The frames are CSS (device-frames.tsx): no bezel image is requested at
 *    any breakpoint, and the aluminium follows the theme.
 */

/**
 * Three readable annotations for the screen above them (audit SC-010). The
 * screen is a scaled illustration, so its own text is small on a phone; these
 * say what each part of it shows, at body size, in the page's own text.
 */
const annotations = [
  {
    n: "1",
    title: "Exception queue",
    body: "Each item has an owner and a status, so nothing waits for someone to notice it.",
  },
  {
    n: "2",
    title: "Today's position",
    body: "Attendance and term collections from the records campuses work in.",
  },
  {
    n: "3",
    title: "AEGIS",
    body: "A leadership question answered in plain language, inside the asker's permissions.",
  },
] as const;

export function HeroProductComposition() {
  return (
    <div data-md-skip className="w-full">
      {/* The synthetic-data label sits beside the illustration it qualifies,
          not under the fold of the composition. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Admin &amp; trust command centre</p>
        <SyntheticDataNote variant="chip" label="Illustrative example — synthetic data" />
      </div>

      {/* The screen is 16:10 at every breakpoint. Below lg the box is the
          screen; at lg the aluminium is drawn around it. TiltStage is a
          client island that only adds a pointer listener — the SVG itself is
          still server-rendered markup, so LCP is unaffected. */}
      <TiltStage className="device-stage hero-device">
        <LaptopDevice collapsible shine>
          <HeroWorkflowScreen className="h-full w-full" />
        </LaptopDevice>
      </TiltStage>

      <ol className="mt-5 grid gap-3 sm:grid-cols-3 lg:mt-7" aria-label="What the screen shows">
        {annotations.map((item) => (
          <li key={item.n} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-tint)] font-mono text-xs font-medium text-[color:var(--brand)]"
            >
              {item.n}
            </span>
            <span className="min-w-0 text-sm leading-6">
              <span className="block font-medium text-[color:var(--foreground)]">{item.title}</span>
              <span className="block text-[color:var(--muted-foreground)]">{item.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
