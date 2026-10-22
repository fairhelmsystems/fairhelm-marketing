import { cn } from "@fairhelm/ui/lib/utils";

export type Motif =
  | "grid"
  | "rings"
  | "flow"
  | "bars"
  | "nodes"
  | "ticks"
  | "partition"
  | "shield"
  | "orbit"
  | "waves"
  | "steps"
  | "mesh"
  | "key"
  | "ledger"
  | "funnel"
  | "pulse";

export const MOTIFS: readonly Motif[] = [
  "grid",
  "rings",
  "flow",
  "bars",
  "nodes",
  "ticks",
  "partition",
  "shield",
  "orbit",
  "waves",
  "steps",
  "mesh",
  "key",
  "ledger",
  "funnel",
  "pulse",
];

export function CardMotif({ motif, className }: { motif: Motif; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 160"
      preserveAspectRatio="xMaxYMin slice"
      className={cn("motif", className)}
    >
      {renderMotif(motif)}
    </svg>
  );
}

function renderMotif(motif: Motif) {
  switch (motif) {
    case "grid":
      return <GridMotif />;
    case "rings":
      return <RingsMotif />;
    case "flow":
      return <FlowMotif />;
    case "bars":
      return <BarsMotif />;
    case "nodes":
      return <NodesMotif />;
    case "ticks":
      return <TicksMotif />;
    case "partition":
      return <PartitionMotif />;
    case "shield":
      return <ShieldMotif />;
    case "orbit":
      return <OrbitMotif />;
    case "waves":
      return <WavesMotif />;
    case "steps":
      return <StepsMotif />;
    case "mesh":
      return <MeshMotif />;
    case "key":
      return <KeyMotif />;
    case "ledger":
      return <LedgerMotif />;
    case "funnel":
      return <FunnelMotif />;
    case "pulse":
      return <PulseMotif />;
    default: {
      const exhaustive: never = motif;
      return exhaustive;
    }
  }
}

function GridMotif() {
  const cols = [156, 184, 212, 240];
  const rows = [8, 36, 64, 92, 120];
  return (
    <>
      {rows.map((y, rowIndex) =>
        cols.map((x, colIndex) => {
          const emphasis = colIndex === 3 && rowIndex < 2;
          const fillOpacity = 0.04 + (colIndex / 3) * 0.05 + ((4 - rowIndex) / 4) * 0.03;
          return (
            <circle
              key={`grid-${x}-${y}`}
              cx={x}
              cy={y}
              r={emphasis ? 1.6 : 1.2}
              fill="currentColor"
              fillOpacity={fillOpacity}
              stroke={emphasis ? "currentColor" : undefined}
              strokeOpacity={emphasis ? 0.4 : undefined}
              strokeWidth={emphasis ? 0.75 : undefined}
            />
          );
        })
      )}
    </>
  );
}

function RingsMotif() {
  const radii = [18, 34, 52, 72];
  return (
    <>
      {radii.map((r, i) => (
        <circle
          key={`ring-${r}`}
          cx={230}
          cy={10}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.75 - i * 0.14}
          strokeWidth={i === 0 ? 1.25 : 1}
          strokeDasharray={i === 2 ? "3 5" : undefined}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function FlowMotif() {
  const paths = [
    { d: "M240 14 C200 14 220 60 198 78", strokeOpacity: 0.5 },
    { d: "M240 46 C205 46 210 66 198 78", strokeOpacity: 0.65 },
    { d: "M240 96 C205 96 200 84 198 78", strokeOpacity: 0.8 },
    { d: "M240 132 C205 132 205 96 198 78", strokeOpacity: 0.4 },
  ];
  const beads = [
    { cx: 222, cy: 30 },
    { cx: 220, cy: 90 },
    { cx: 215, cy: 115 },
  ];
  return (
    <>
      {paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          fill="none"
          stroke="currentColor"
          strokeOpacity={path.strokeOpacity}
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
      {beads.map((bead) => (
        <circle
          key={`bead-${bead.cx}-${bead.cy}`}
          cx={bead.cx}
          cy={bead.cy}
          r={2}
          fill="currentColor"
          fillOpacity={0.1}
        />
      ))}
      <circle
        cx={198}
        cy={78}
        r={3.5}
        fill="currentColor"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeOpacity={0.8}
        strokeWidth={1}
      />
    </>
  );
}

function BarsMotif() {
  const bars = [
    { x: 136, height: 18 },
    { x: 154, height: 26 },
    { x: 172, height: 34 },
    { x: 190, height: 44 },
    { x: 208, height: 56 },
    { x: 226, height: 70 },
  ];
  const baseline = 140;
  const trendPoints = bars.map((bar) => `${bar.x + 5} ${baseline - bar.height - 2}`).join(" ");
  return (
    <>
      <line
        x1={130}
        y1={baseline}
        x2={236}
        y2={baseline}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={0.75}
        strokeLinecap="round"
      />
      {bars.map((bar, i) => (
        <rect
          key={`bar-${bar.x}`}
          x={bar.x}
          y={baseline - bar.height}
          width={10}
          height={bar.height}
          rx={2}
          fill="currentColor"
          fillOpacity={0.05 + i * 0.008}
          stroke="currentColor"
          strokeOpacity={0.4 + i * 0.03}
          strokeWidth={0.75}
        />
      ))}
      <polyline
        points={trendPoints}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function NodesMotif() {
  const nodes = [
    { id: "n0", x: 150, y: 20 },
    { id: "n1", x: 190, y: 14 },
    { id: "n2", x: 228, y: 30 },
    { id: "n3", x: 210, y: 60 },
    { id: "n4", x: 170, y: 66 },
    { id: "n5", x: 196, y: 96 },
    { id: "n6", x: 230, y: 110 },
  ] as const;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges: ReadonlyArray<readonly [string, string]> = [
    ["n0", "n1"],
    ["n1", "n2"],
    ["n1", "n3"],
    ["n3", "n2"],
    ["n3", "n4"],
    ["n3", "n5"],
    ["n5", "n6"],
    ["n4", "n5"],
  ];
  return (
    <>
      {edges.map(([from, to]) => {
        const a = byId[from];
        const b = byId[to];
        return (
          <line
            key={`edge-${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={0.75}
            strokeLinecap="round"
          />
        );
      })}
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={3.2}
          fill={node.id === "n3" ? "currentColor" : "none"}
          fillOpacity={node.id === "n3" ? 0.12 : undefined}
          stroke="currentColor"
          strokeOpacity={0.7}
          strokeWidth={1}
        />
      ))}
    </>
  );
}

function TicksMotif() {
  const ticks = Array.from({ length: 12 }, (_, i) => 40 + i * 17);
  const highlighted = ticks[8];
  return (
    <>
      <line
        x1={30}
        y1={100}
        x2={236}
        y2={100}
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={0.75}
        strokeLinecap="round"
      />
      {ticks.map((x) =>
        x === highlighted ? null : (
          <line
            key={`tick-${x}`}
            x1={x}
            y1={96}
            x2={x}
            y2={104}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={0.75}
            strokeLinecap="round"
          />
        )
      )}
      <line
        x1={highlighted}
        y1={90}
        x2={highlighted}
        y2={110}
        stroke="currentColor"
        strokeOpacity={0.8}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle
        cx={highlighted}
        cy={100}
        r={2.5}
        fill="currentColor"
        fillOpacity={0.1}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={0.75}
      />
    </>
  );
}

function PartitionMotif() {
  const lanes = [120, 150, 180, 210];
  return (
    <>
      <rect x={150} y={6} width={30} height={148} fill="currentColor" fillOpacity={0.06} />
      {lanes.map((x) => (
        <line
          key={`lane-${x}`}
          x1={x}
          y1={6}
          x2={x}
          y2={154}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={0.75}
          strokeLinecap="round"
        />
      ))}
      <rect
        x={158}
        y={68}
        width={14}
        height={11}
        rx={1.5}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={1}
      />
      <path
        d="M161 68 V64 A4 4 0 0 1 169 64 V68"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </>
  );
}

function ShieldMotif() {
  return (
    <>
      <path
        d="M195 10 L228 24 V80 C228 112 213 136 195 150 C177 136 162 112 162 80 V24 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M195 34 L216 44 V80 C216 100 206 116 195 124 C184 116 174 100 174 80 V44 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="180 78 192 92 212 62"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function OrbitMotif() {
  return (
    <>
      <ellipse
        cx={198}
        cy={64}
        rx={70}
        ry={26}
        transform="rotate(18 198 64)"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      <ellipse
        cx={198}
        cy={64}
        rx={60}
        ry={20}
        transform="rotate(-24 198 64)"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={0.9}
      />
      <circle
        cx={198}
        cy={64}
        r={3}
        fill="currentColor"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={0.75}
      />
      <circle
        cx={236}
        cy={34}
        r={2.5}
        fill="currentColor"
        fillOpacity={0.1}
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={0.75}
      />
      <circle
        cx={150}
        cy={86}
        r={2.5}
        fill="currentColor"
        fillOpacity={0.1}
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={0.75}
      />
    </>
  );
}

function WavesMotif() {
  const waves = [
    {
      d: "M10 40 C50 25 90 55 130 40 C170 25 210 55 236 42",
      strokeOpacity: 0.6,
    },
    {
      d: "M10 76 C50 92 90 60 130 76 C170 92 210 60 236 74",
      strokeOpacity: 0.45,
    },
    {
      d: "M10 112 C50 100 90 124 130 112 C170 100 210 124 236 110",
      strokeOpacity: 0.3,
    },
  ];
  return (
    <>
      {waves.map((wave) => (
        <path
          key={wave.d}
          d={wave.d}
          fill="none"
          stroke="currentColor"
          strokeOpacity={wave.strokeOpacity}
          strokeWidth={1}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function StepsMotif() {
  const steps = [
    { x: 120, height: 16 },
    { x: 144, height: 30 },
    { x: 168, height: 44 },
    { x: 192, height: 58 },
    { x: 216, height: 72 },
  ];
  const baseline = 150;
  return (
    <>
      <line
        x1={118}
        y1={152}
        x2={238}
        y2={76}
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={0.75}
        strokeLinecap="round"
      />
      {steps.map((step, i) => (
        <rect
          key={`step-${step.x}`}
          x={step.x}
          y={baseline - step.height}
          width={20}
          height={step.height}
          rx={2}
          fill="currentColor"
          fillOpacity={0.05 + i * 0.01}
          stroke="currentColor"
          strokeOpacity={0.4 + i * 0.06}
          strokeWidth={0.9}
        />
      ))}
    </>
  );
}

function MeshMotif() {
  const familyA = Array.from({ length: 4 }, (_, i) => -40 + i * 40);
  const familyB = Array.from({ length: 4 }, (_, i) => 120 + i * 40);
  const dots = [
    { x: 100, y: 60 },
    { x: 140, y: 60 },
    { x: 80, y: 80 },
    { x: 120, y: 80 },
  ];
  return (
    <>
      {familyA.map((x0) => (
        <line
          key={`mesh-a-${x0}`}
          x1={x0}
          y1={0}
          x2={x0 + 160}
          y2={160}
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth={0.75}
          strokeLinecap="round"
        />
      ))}
      {familyB.map((xTop) => (
        <line
          key={`mesh-b-${xTop}`}
          x1={xTop}
          y1={0}
          x2={xTop - 160}
          y2={160}
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth={0.75}
          strokeLinecap="round"
        />
      ))}
      {dots.map((dot) => (
        <circle
          key={`mesh-dot-${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={1.4}
          fill="currentColor"
          fillOpacity={0.1}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={0.75}
        />
      ))}
    </>
  );
}

function KeyMotif() {
  return (
    <>
      <circle
        cx={170}
        cy={30}
        r={16}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.6}
        strokeWidth={1.25}
      />
      <circle
        cx={170}
        cy={30}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={0.75}
      />
      <line
        x1={186}
        y1={30}
        x2={236}
        y2={30}
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <line
        x1={214}
        y1={30}
        x2={214}
        y2={40}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <line
        x1={226}
        y1={30}
        x2={226}
        y2={38}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </>
  );
}

function LedgerMotif() {
  const rows = [16, 38, 60, 82, 104, 126, 148];
  const highlighted = rows[3];
  return (
    <>
      {rows.map((y) => (
        <rect
          key={`ledger-fill-${y}`}
          x={14}
          y={y - 8}
          width={208}
          height={16}
          fill="currentColor"
          fillOpacity={y === highlighted ? 0.06 : 0}
        />
      ))}
      {rows.map((y) => (
        <line
          key={`ledger-row-${y}`}
          x1={14}
          y1={y}
          x2={222}
          y2={y}
          stroke="currentColor"
          strokeOpacity={y === highlighted ? 0.7 : 0.3}
          strokeWidth={y === highlighted ? 1.25 : 0.75}
          strokeLinecap="round"
        />
      ))}
      {rows.map((y) => (
        <line
          key={`ledger-tick-${y}`}
          x1={226}
          y1={y - 4}
          x2={226}
          y2={y + 4}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={0.75}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function FunnelMotif() {
  const trapezoids = [
    {
      d: "M155 20 L235 20 L205 130 L185 130 Z",
      strokeOpacity: 0.55,
      fillOpacity: 0.05,
    },
    {
      d: "M163 40 L227 40 L202 122 L188 122 Z",
      strokeOpacity: 0.4,
      fillOpacity: 0,
    },
    {
      d: "M171 60 L219 60 L199 114 L191 114 Z",
      strokeOpacity: 0.28,
      fillOpacity: 0,
    },
  ];
  return (
    <>
      {trapezoids.map((trapezoid) => (
        <path
          key={trapezoid.d}
          d={trapezoid.d}
          fill={trapezoid.fillOpacity > 0 ? "currentColor" : "none"}
          fillOpacity={trapezoid.fillOpacity > 0 ? trapezoid.fillOpacity : undefined}
          stroke="currentColor"
          strokeOpacity={trapezoid.strokeOpacity}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <circle
        cx={195}
        cy={142}
        r={3}
        fill="currentColor"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeOpacity={0.7}
        strokeWidth={0.75}
      />
    </>
  );
}

function PulseMotif() {
  const gridLines = [20, 60, 100, 140, 180, 220];
  return (
    <>
      <line
        x1={14}
        y1={90}
        x2={236}
        y2={90}
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={0.75}
        strokeLinecap="round"
      />
      {gridLines.map((x) => (
        <line
          key={`pulse-grid-${x}`}
          x1={x}
          y1={10}
          x2={x}
          y2={150}
          stroke="currentColor"
          strokeOpacity={0.12}
          strokeWidth={0.75}
        />
      ))}
      <polyline
        points="20 90 50 90 60 60 70 120 80 40 90 90 130 90 140 80 150 100 160 90 236 90"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
