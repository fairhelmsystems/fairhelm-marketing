import React from "react";
import { Composition } from "remotion";
import { compositionId, MOTION_ENTRIES, THEME_NAMES } from "./registry";
import { CANVAS } from "./theme";

/**
 * Every composition is registered twice, once per site theme. Only one of the
 * two ever reaches a visitor — the delivery component on the website picks the
 * variant matching `data-theme` before it attaches a video source.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {MOTION_ENTRIES.flatMap((entry) =>
        THEME_NAMES.map((theme) => (
          <Composition
            key={compositionId(entry, theme)}
            id={compositionId(entry, theme)}
            component={entry.component}
            durationInFrames={entry.durationInFrames}
            fps={CANVAS.fps}
            width={entry.width}
            height={entry.height}
            defaultProps={entry.props(theme)}
          />
        ))
      )}
    </>
  );
};
