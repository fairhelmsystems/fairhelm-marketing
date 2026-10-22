import { Eyebrow } from "@fairhelm/ui/components/marketing";

/**
 * Why the marginal rate declines with enrolment.
 *
 * The chart is deliberately unlabelled on its value axis — it shows direction,
 * not a rate card. Nothing here can be reverse-engineered into a price.
 */

const bands = [
  { height: 96, opacity: 1 },
  { height: 82, opacity: 0.92 },
  { height: 70, opacity: 0.84 },
  { height: 60, opacity: 0.76 },
  { height: 52, opacity: 0.68 },
  { height: 46, opacity: 0.6 },
] as const;

const chain = [
  { term: "Platform foundation", detail: "Shared capacity, security and operations." },
  { term: "Greater utilisation", detail: "Larger enrolments use that foundation more fully." },
  { term: "Lower marginal rate", detail: "The benefit returns to the institution." },
] as const;

function MarginalRateChart() {
  return (
    // `flex-1` on the plot area lets the chart absorb whatever height the
    // panel has, instead of a fixed 8rem plot leaving the panel half empty.
    <div
      data-md-skip
      className="flex min-h-0 flex-1 flex-col rounded-[var(--radius-panel)] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5 sm:p-6"
    >
      {/* The eyebrow's wide letter-spacing needs its own line on narrow phones,
          otherwise the axis label collides with it. */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <p className="eyebrow">Marginal rate per student</p>
        <p className="type-caption">Enrolment &rarr;</p>
      </div>

      <div
        role="img"
        aria-label="A column chart showing the marginal rate per student stepping down as enrolment grows across successive volume bands. The chart shows direction only and carries no values."
        className="mt-5 flex min-h-[8rem] flex-1 items-end gap-1.5 sm:gap-2"
      >
        {bands.map((band) => (
          <span
            key={band.height}
            className="flex-1 rounded-t-[0.35rem] bg-[color:var(--brand)]"
            style={{ height: `${band.height}%`, opacity: band.opacity }}
          />
        ))}
      </div>

      <div className="mt-3 border-t border-[color:var(--line-strong)] pt-3">
        <p className="type-caption">
          Shared platform foundation &mdash; constant across every band
        </p>
      </div>
    </div>
  );
}

export function VolumeRationale() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5">
      <div className="surface-panel rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
        <Eyebrow>The institution benefits from its own scale</Eyebrow>
        <p className="type-body mt-4 text-[color:var(--muted-foreground)]">
          SquareCampus maintains one shared platform baseline &mdash; capacity, security,
          observability, workflow infrastructure and the operations behind them. That baseline does
          not multiply with every additional student.
        </p>
        <p className="type-body mt-4 text-[color:var(--muted-foreground)]">
          Larger institutions therefore receive the benefit of platform economies of scale. The
          marginal rate reduces as enrolment grows, while the selected plan reflects the workflow,
          analytics, governance and deployment depth required. An institution is not charged the
          entry rate indefinitely for growing.
        </p>

        <ol className="mt-8 space-y-3">
          {chain.map((link, index) => (
            <li
              key={link.term}
              className="flex items-start gap-3 rounded-[var(--radius-chip)] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3.5"
            >
              <span className="type-caption mt-0.5 shrink-0 text-[color:var(--brand)]">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[color:var(--foreground)]">{link.term}</p>
                <p className="type-support mt-1">{link.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="surface-panel-strong flex flex-col rounded-[var(--radius-panel-lg)] p-6 sm:p-8">
        <MarginalRateChart />
        <p className="type-support mt-5 shrink-0">
          Pricing uses progressive, volume-based student bands. The chart shows the direction of the
          marginal rate as enrolment grows &mdash; the bands themselves are set out in your
          proposal.
        </p>
      </div>
    </div>
  );
}
