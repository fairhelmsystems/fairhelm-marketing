import React from "react";
import { useCurrentFrame } from "remotion";
import { draw, Header, Label, Meta, Panel, rise, Stage, StatusChip, window_ } from "../kit";
import { FONT, THEMES, type ThemeName, type as typeScale } from "../theme";

/**
 * OneCoreManySurfaces
 *
 * One sentence: the surfaces of a school do not exchange exports with each
 * other — they act on one shared identity, data and workflow core.
 *
 * Two variants, deliberately different arguments so the two pages that use
 * them do not end up saying the same thing:
 *  - `architecture` (/platform/) — the surfaces are operational functions.
 *  - `audience`     (/ecosystem/) — the surfaces are the people involved.
 *
 * Each surface owns its own connector column, so a longer label widens its
 * column and its line stays centred under it. Percentage-positioned
 * connectors drifted the moment one label was longer than the others.
 *
 * There is no title card. The last frame — every surface connected, one change
 * already propagated — is the poster.
 */

export type SurfacesVariant = "architecture" | "audience";
export type OneCoreManySurfacesProps = { theme: ThemeName; variant: SurfacesVariant };

export const oneCoreDuration = 264;

const CONTENT: Record<
  SurfacesVariant,
  { eyebrow: string; title: string; surfaces: string[]; core: string; coreMeta: string; closing: string }
> = {
  architecture: {
    eyebrow: "Platform architecture",
    title: "Five surfaces. One core they all act on.",
    surfaces: ["Admissions", "Academics", "Finance", "Communication", "Operations"],
    core: "One identity, data and workflow core",
    coreMeta: "Policy, ownership and audit live here",
    closing: "Every other surface is already current. Nothing was exported.",
  },
  audience: {
    eyebrow: "Connected ecosystem",
    title: "Everyone acts on the same record.",
    surfaces: ["Parents", "Teachers", "Principals", "Finance", "Trustees"],
    core: "One institutional record",
    coreMeta: "Each role sees the part it owns",
    closing: "Nobody is waiting for someone else's spreadsheet.",
  },
};

/** The surface whose change propagates in the closing beat. */
const PULSE_INDEX = 2;
const LINK_HEIGHT = 84;

export const OneCoreManySurfaces: React.FC<OneCoreManySurfacesProps> = ({ theme, variant }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const c = CONTENT[variant];

  const fragmented = window_(frame, 18, 106, 10);
  const connected = draw(frame, 110, 18);
  const pulse = draw(frame, 178, 20);
  const pulsing = frame >= 170 && frame < 226;

  return (
    <Stage theme={t}>
      <Header theme={t} compact eyebrow={c.eyebrow} title={c.title} frame={frame} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {c.surfaces.map((surface, i) => (
              <div
                key={surface}
                style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}
              >
                <Panel
                  theme={t}
                  state={
                    pulsing && i === PULSE_INDEX
                      ? "active"
                      : connected > 0.6
                        ? "settled"
                        : "resting"
                  }
                  style={{ padding: "14px 16px", alignItems: "center" }}
                >
                  <Label theme={t} size={34}>
                    <span style={{ whiteSpace: "nowrap" }}>{surface}</span>
                  </Label>
                </Panel>

                {/* Connector column: centred under its own surface by construction */}
                <div
                  style={{
                    height: LINK_HEIGHT,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: `${connected * 100}%`,
                      backgroundColor:
                        pulsing && i === PULSE_INDEX ? t.brand : t.lineStrong,
                      borderRadius: 2,
                    }}
                  />
                  {i === PULSE_INDEX ? (
                    <div
                      style={{
                        position: "absolute",
                        top: (LINK_HEIGHT - 13) * pulse,
                        width: 13,
                        height: 13,
                        borderRadius: 999,
                        backgroundColor: t.brand,
                        opacity: pulsing ? 1 : 0,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Beat 1, overlaid on the connector band: the reconciliation tax */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: LINK_HEIGHT,
              opacity: fragmented,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              backgroundColor: t.bg,
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: 150, borderTop: `3px dashed ${t.faint}` }} />
              ))}
            </div>
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: typeScale.meta,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: t.dim,
              }}
            >
              Export · reconcile · repeat
            </div>
          </div>
        </div>

        <Panel
          theme={t}
          state={connected > 0.6 ? "active" : "resting"}
          style={{ padding: "16px 24px", ...rise(frame, 108) }}
        >
          <Label theme={t} size={42} tone="brand">
            {c.core}
          </Label>
          <Meta theme={t}>{c.coreMeta}</Meta>
        </Panel>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 20,
            alignItems: "center",
            opacity: draw(frame, 208, 14),
          }}
        >
          <StatusChip theme={t} tone="teal">
            Updated once
          </StatusChip>
          <div style={{ fontFamily: FONT.body, fontSize: typeScale.body, color: t.muted }}>
            {c.closing}
          </div>
        </div>
      </div>
    </Stage>
  );
};
