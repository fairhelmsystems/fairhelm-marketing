"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { MotionPoster } from "@/components/site/motion-poster";
import { motionAssets } from "@/content/motion-assets";
import { aicStages, type AicScenario, type WalkthroughState } from "@/lib/aic-walkthrough";

/** The walkthrough owns transitions. This view only plays the current rendered segment. */
export function AicMotionArtwork({
  scenario,
  state,
  reducedMotion,
}: {
  scenario: AicScenario;
  state: WalkthroughState;
  reducedMotion: boolean;
}) {
  const asset = motionAssets[`aic-${scenario.id}`];
  const stage = aicStages[state.stage];
  const segment = asset.segments[state.stage];
  const videoRef = useRef<HTMLVideoElement>(null);
  const positioned = useRef("");
  const previous = useRef(state);
  const finishing = useRef(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [saveData, setSaveData] = useState(true);
  const source = asset[theme];
  const normal = state.boundary === "normal";
  const allowed = normal && !reducedMotion && !failed && !saveData;

  useEffect(() => {
    const update = () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    update();
    const observer = new MutationObserver(update);
    const hide = () => {
      if (document.hidden) {
        finishing.current = false;
        videoRef.current?.pause();
      }
    };
    document.addEventListener("visibilitychange", hide);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }
    ).connection;
    const update = () => setSaveData(connection?.saveData === true);
    update();
    connection?.addEventListener("change", update);
    return () => connection?.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (state.mode === "playing" && allowed) setRequested(true);
  }, [state.mode, allowed]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    const prior = previous.current;
    previous.current = state;
    if (state.mode === "idle" && prior.mode !== "idle") positioned.current = "";
    if (prior.stage !== state.stage) {
      finishing.current = state.mode === "complete" && prior.mode === "playing";
    }
    if (!allowed || !requested) {
      video?.pause();
      if (video?.currentSrc && !allowed) video.load();
      positioned.current = "";
      setReady(false);
      return;
    }
    if (!video) return;
    const key = `${theme}-${state.scenarioId}-${state.stage}`;
    if (positioned.current !== key) setReady(false);
    const start = segment.startFrame / asset.fps;
    const end = (segment.startFrame + segment.durationInFrames - 1) / asset.fps;
    const play = state.mode === "playing" || finishing.current;
    let active = true;
    const sync = () => {
      if (positioned.current !== key) {
        setReady(false);
        video.pause();
        video.currentTime = play ? start : end;
        positioned.current = key;
      }
      if (play) {
        if (video.currentTime >= end) video.currentTime = start;
        video.play().catch((error: Error) => {
          if (active && error.name !== "AbortError") setFailed(true);
        });
      } else {
        video.pause();
      }
    };
    if (video.readyState >= 1) sync();
    video.addEventListener("loadedmetadata", sync);
    return () => {
      active = false;
      video.pause();
      video.removeEventListener("loadedmetadata", sync);
    };
  }, [state, allowed, requested, theme, segment, asset.fps]);

  if (!normal) {
    return (
      <div className="aic-motion-boundary" data-testid="aic-motion-boundary">
        <ShieldCheck aria-hidden />
        <h4>Inspect this boundary case</h4>
        <p>The stage evidence reflects the selected access, policy or execution boundary.</p>
      </div>
    );
  }

  const still = {
    ...asset,
    light: { poster: asset.light.stills[stage.id] },
    dark: { poster: asset.dark.stills[stage.id] },
  };
  return (
    <div
      className="aic-motion-view"
      data-testid="aic-motion"
      data-stage={stage.id}
      data-video-ready={ready}
    >
      <MotionPoster asset={still} alt="" className="aic-motion-poster" />
      {/* Silent authored diagram. The stage caption, records and answer remain readable DOM. */}
      <video
        ref={videoRef}
        aria-hidden="true"
        tabIndex={-1}
        muted
        playsInline
        poster={requested && allowed ? source.stills[stage.id] : undefined}
        preload={requested && allowed ? "auto" : "none"}
        disablePictureInPicture
        src={requested && allowed ? source.mp4 : undefined}
        onLoadStart={() => setReady(false)}
        onSeeked={(event) => {
          if (!event.currentTarget.seeking) setReady(true);
        }}
        onPlaying={(event) => {
          if (!event.currentTarget.seeking) setReady(true);
        }}
        onError={() => {
          setFailed(true);
          setReady(false);
        }}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          const end = (segment.startFrame + segment.durationInFrames - 1) / asset.fps;
          if (video.currentTime >= end) {
            video.pause();
            finishing.current = false;
            if (video.currentTime > end + 1 / asset.fps) video.currentTime = end;
          }
        }}
      />
      {failed && (
        <p className="aic-motion-fallback">Stage controls and sample evidence remain available.</p>
      )}
    </div>
  );
}
