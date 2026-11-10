import type { AicScenarioId } from "@fairhelm/squarecampus-content/aic-walkthrough";
export {
  aicScenarios,
  aicStages,
  calculateScenario,
  type AicScenario,
  type AicScenarioId,
  type AicStage,
  type ScenarioResult,
} from "@fairhelm/squarecampus-content/aic-walkthrough";

export type AicBoundary =
  | "normal"
  | "access-denied"
  | "scope-unapproved"
  | "missing-policy"
  | "platform-failure"
  | "zero-matches";
export type WalkthroughState = {
  scenarioId: AicScenarioId;
  stage: number;
  mode: "idle" | "playing" | "paused" | "approval" | "blocked" | "complete";
  approved: boolean;
  boundary: AicBoundary;
};
export function initialWalkthrough(scenarioId: AicScenarioId): WalkthroughState {
  return { scenarioId, stage: 0, mode: "idle", approved: false, boundary: "normal" };
}
export type WalkthroughAction =
  | { type: "scenario"; id: AicScenarioId }
  | { type: "boundary"; boundary: AicBoundary }
  | { type: "next"; autoplay?: boolean }
  | { type: "approve"; autoplay: boolean }
  | { type: "play" | "pause" | "previous" | "replay" | "retry" };

export function walkthroughReducer(
  state: WalkthroughState,
  action: WalkthroughAction
): WalkthroughState {
  switch (action.type) {
    case "scenario":
      return initialWalkthrough(action.id);
    case "boundary":
      return { ...initialWalkthrough(state.scenarioId), boundary: action.boundary };
    case "pause":
      return state.mode === "playing" ? { ...state, mode: "paused" } : state;
    case "play":
      if (state.mode === "blocked" || state.mode === "approval") return state;
      return state.mode === "complete"
        ? { ...initialWalkthrough(state.scenarioId), boundary: state.boundary, mode: "playing" }
        : { ...state, mode: "playing" };
    case "replay":
      return { ...initialWalkthrough(state.scenarioId), boundary: state.boundary };
    case "retry":
      return state.mode === "blocked" && state.boundary === "platform-failure"
        ? { ...state, stage: 4, boundary: "normal", mode: "paused" }
        : state;
    case "previous": {
      const stage = Math.max(0, state.stage - 1);
      return {
        ...state,
        stage,
        approved: stage > 3 && state.approved,
        mode: stage === 3 ? "approval" : "paused",
      };
    }
    case "approve":
      if (state.stage !== 3 || state.mode !== "approval" || state.boundary === "scope-unapproved")
        return state;
      return { ...state, stage: 4, approved: true, mode: action.autoplay ? "playing" : "paused" };
    case "next": {
      if (
        state.mode === "blocked" ||
        state.mode === "complete" ||
        (state.stage >= 3 && !state.approved)
      )
        return state;
      const stage = Math.min(7, state.stage + 1);
      const blocked =
        (stage === 1 && state.boundary === "access-denied") ||
        (stage === 2 && state.boundary === "missing-policy") ||
        (stage === 5 && state.boundary === "platform-failure");
      const mode = blocked
        ? "blocked"
        : stage === 3
          ? "approval"
          : stage === 7
            ? "complete"
            : action.autoplay
              ? "playing"
              : "paused";
      return { ...state, stage, mode };
    }
  }
}
