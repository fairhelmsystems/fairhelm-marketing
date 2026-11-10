"use client";

import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { AicMotionArtwork } from "@/components/pricing/aic-motion-artwork";
import { MotionPoster } from "@/components/site/motion-poster";
import { motionAssets } from "@/content/motion-assets";
import { aicScenarioSummaries } from "@/content/aic-walkthrough";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useState } from "react";
import { Button } from "@fairhelm/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@fairhelm/ui/components/toggle-group";
import {
  aicScenarios,
  aicStages,
  calculateScenario,
  initialWalkthrough,
  walkthroughReducer,
  type AicBoundary,
  type AicScenario,
  type AicScenarioId,
  type WalkthroughState,
} from "@/lib/aic-walkthrough";

const BottomSheet = dynamic(() => import("@fairhelm/ui/components/bottom-sheet"), { ssr: false });

function ScenarioAnswer({ scenario, empty = false }: { scenario: AicScenario; empty?: boolean }) {
  const result = calculateScenario(scenario);
  const bars = empty ? [] : result.bars;
  const maximum = Math.max(...bars.map((bar) => bar.value), 1);
  return (
    <div className="aic-sample-answer" data-testid="aic-sample-answer">
      <h4>{scenario.label} sample answer</h4>
      <p className="aic-answer-summary">
        {empty
          ? "No sample records match the approved scope. A valid zero-match answer completes the operation under its accepted quote."
          : result.summary}
      </p>
      {bars.length > 0 && (
        <figure
          className="aic-result-chart"
          aria-label={
            scenario.id === "fee-reconciliation"
              ? "Sample outstanding balance by campus"
              : "Sample attendance percentages"
          }
        >
          {bars.map((bar) => (
            <div key={bar.label} className="aic-result-bar">
              <span>{bar.label}</span>
              <svg viewBox="0 0 240 16" role="img" aria-label={`${bar.label}, ${bar.display}`}>
                <rect className="aic-chart-track" width="240" height="16" rx="4" />
                <g className="aic-chart-bar" transform={`scale(${bar.value / maximum} 1)`}>
                  <rect width="240" height="16" rx="4" />
                </g>
              </svg>
              <strong>{bar.display}</strong>
            </div>
          ))}
          <figcaption>Sample data. Exact figures are provided in the table.</figcaption>
        </figure>
      )}
      <section
        className="aic-answer-table"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the evidence region in Safari.
        tabIndex={0}
        aria-label={`${scenario.label} sample evidence table`}
      >
        <table>
          <caption>Authored sample records</caption>
          <thead>
            <tr>
              {result.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!empty &&
              result.rows.map((row) => (
                <tr key={row.id} data-finding={row.finding}>
                  {row.cells.map((cell, index) =>
                    index === 0 ? (
                      <th key={result.columns[index]} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={result.columns[index]}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
          </tbody>
          {result.footer && !empty && (
            <tfoot>
              <tr>
                {result.footer.map((cell, index) =>
                  index === 0 ? (
                    <th key={result.columns[index]} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={result.columns[index]}>{cell}</td>
                  )
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </section>
      {scenario.id === "attendance-check" && (
        <p>Student D is exactly at 85% and is excluded from the below-threshold result.</p>
      )}
      {scenario.id === "fee-reconciliation" && (
        <p>
          Only charges already more than 30 days overdue are included. The ₹15,000 pending
          concession is excluded.
        </p>
      )}
      {scenario.id === "policy-aware-review" && (
        <p>
          Review the attendance evidence and assessment coverage with the relevant academic owners.
          This pattern does not establish that attendance caused the marks decline.
        </p>
      )}
      <p className="aic-source-line">
        Sample policy {scenario.policy.id}.{" "}
        {scenario.id === "policy-aware-review"
          ? "Sample attendance, cohort membership and previous/current term marks."
          : scenario.id === "fee-reconciliation"
            ? "Sample charges, approved concessions and posted, allocated receipts. As of 2 November 2026."
            : "Sample Class 8 attendance and eligible sessions, North Campus."}
      </p>
    </div>
  );
}

function StageEvidence({ scenario, state }: { scenario: AicScenario; state: WalkthroughState }) {
  if (state.stage === 2) {
    return (
      <div className="aic-stage-evidence">
        <h4>Rules for this question</h4>
        {scenario.id === "attendance-check" ? (
          <p>
            Eligible sessions exclude the school-policy calendar exceptions. Include attendance
            strictly below {scenario.policy.thresholdPercent}%. A student exactly at the threshold
            stays outside the result.
          </p>
        ) : scenario.id === "fee-reconciliation" ? (
          <p>
            Charges must be more than {scenario.policy.minimumOverdueDaysExclusive} days overdue.
            Deduct approved concessions and posted, allocated receipts. The pending concession stays
            outside the calculation.
          </p>
        ) : (
          <>
            <dl className="aic-policy-thresholds">
              {Object.entries(scenario.policy.campusAttendanceThresholdPercent).map(
                ([campus, threshold]) => (
                  <div key={campus}>
                    <dt>
                      {campus === "north" ? "North" : campus === "central" ? "Central" : "South"}
                    </dt>
                    <dd className="aic-policy-threshold">{threshold}% attendance</dd>
                  </div>
                )
              )}
            </dl>
            <p>
              Both conditions must hold. Attendance is below that campus’s requirement and average
              marks declined by at least {scenario.policy.minimumMarksDeclinePoints} points on a{" "}
              {scenario.policy.marksScale}-point scale. Missing evidence remains unavailable.
            </p>
          </>
        )}
      </div>
    );
  }
  if (!state.approved || state.mode === "blocked" || state.stage < 4 || state.stage > 5)
    return null;
  const result = calculateScenario(scenario);
  return (
    <div className="aic-stage-evidence">
      <h4>
        {state.stage === 4
          ? "Permitted sample records"
          : scenario.id === "policy-aware-review"
            ? "Two conditions, one comparison"
            : "One reconciled dataset"}
      </h4>
      {scenario.id === "attendance-check" ? (
        <ul className="aic-calculation-lanes">
          {scenario.students.map((student) => (
            <li key={student.id}>
              <strong>{student.label}</strong>
              <span className="aic-calculation-cell">
                {student.attendedSessions} attended / {student.eligibleSessions} eligible sessions
              </span>
              <span className="aic-calculation-cell">
                {state.stage === 5
                  ? result.matchedIds.includes(student.id)
                    ? "Below 85%, included"
                    : "Exactly 85%, excluded"
                  : "Attendance and calendar evidence"}
              </span>
            </li>
          ))}
        </ul>
      ) : scenario.id === "fee-reconciliation" ? (
        <ul className="aic-calculation-lanes">
          {result.rows.map((row) => (
            <li key={row.id}>
              <strong>{row.cells[0]}</strong>
              <span className="aic-calculation-cell">
                {row.cells[1]} − {row.cells[2]} − {row.cells[3]}
              </span>
              <span className="aic-calculation-cell">
                {state.stage === 5
                  ? `Outstanding ${row.cells[4]}`
                  : "Charges − approved concessions − allocated receipts"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="aic-calculation-lanes">
          {result.rows.map((row) => (
            <li key={row.id} data-finding={row.finding}>
              <strong>{row.cells[0]}</strong>
              <span className="aic-calculation-cell">
                Attendance {row.cells[1]} / required {row.cells[2]}
              </span>
              <span className="aic-calculation-cell">Marks change {row.cells[3]}</span>
              {state.stage === 5 && <span className="aic-calculation-cell">{row.cells[4]}</span>}
            </li>
          ))}
        </ul>
      )}
      <p>Policy {scenario.policy.id}. Source versions stay attached to the answer.</p>
    </div>
  );
}

function WalkthroughPlayer({ initialScenario }: { initialScenario: AicScenarioId }) {
  const [state, dispatch] = useReducer(walkthroughReducer, initialScenario, initialWalkthrough);
  const [reducedMotion, setReducedMotion] = useState(true);
  const scenario = aicScenarios.find((item) => item.id === state.scenarioId) ?? aicScenarios[0];
  const current = aicStages[state.stage];
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) dispatch({ type: "pause" });
    };
    const visibility = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    update();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (state.mode !== "playing" || reducedMotion || document.hidden) return;
    const duration = scenario.stageDurationsMs[state.stage];
    if (duration === null) return;
    const timer = window.setTimeout(() => dispatch({ type: "next", autoplay: true }), duration);
    return () => window.clearTimeout(timer);
  }, [state, scenario, reducedMotion]);
  const stopped = state.mode === "blocked";
  let boundaryMessage = "";
  if (stopped && state.boundary === "access-denied")
    boundaryMessage = "Access denied. Restricted records stay unread. No AIC charge.";
  if (stopped && state.boundary === "missing-policy")
    boundaryMessage =
      "Required policy unavailable. Resolve the scope before analysis. No AIC charge.";
  if (stopped && state.boundary === "platform-failure")
    boundaryMessage =
      "Platform failure. The illustrated reservation is released. No AIC charge. Retrying this example uses the same approved scope.";
  if (state.mode === "approval" && state.boundary === "scope-unapproved")
    boundaryMessage = "Scope remains unapproved. The operation waits here and records stay unread.";
  return (
    <div
      className="aic-player"
      data-playing={state.mode === "playing"}
      data-motion={!reducedMotion}
      data-testid="aic-player"
    >
      <p className="aic-demo-label">Illustrative walkthrough. Sample data.</p>
      <p>Designed workflow. One approved AIC quote covers the complete analytical operation.</p>
      <ToggleGroup
        aria-label="Choose an AEGIS example"
        value={[state.scenarioId]}
        onValueChange={(values) => {
          const next = aicScenarios.find((item) => item.id === values[0]);
          if (next) dispatch({ type: "scenario", id: next.id });
        }}
        className="aic-scenario-selector"
        variant="outline"
      >
        {aicScenarios.map((item) => (
          <ToggleGroupItem key={item.id} value={item.id}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="aic-request">
        <span>{scenario.role}</span>
        <details>
          <summary>{aicScenarioSummaries[scenario.id]}</summary>
          <blockquote>{scenario.prompt}</blockquote>
        </details>
      </div>
      <section
        className="aic-stage-scene"
        aria-labelledby="aic-current-stage"
        data-stage={current.id}
      >
        <div className="aic-artwork">
          <AicMotionArtwork
            key={state.scenarioId}
            scenario={scenario}
            state={state}
            reducedMotion={reducedMotion}
          />
        </div>
        <div className="aic-motion-sidebar">
          <div className="aic-current-caption">
            <div className="aic-stage-title">
              <h3 id="aic-current-stage">{current.label}</h3>
              <span className="aic-stage-index">
                <span className="sr-only">Stage </span>
                {state.stage + 1} of {aicStages.length}
              </span>
            </div>
            <p>{current.caption}</p>
          </div>
          <div className="aic-playback-controls">
            {!reducedMotion && (
              <Button
                type="button"
                aria-label={state.mode === "playing" ? "Pause" : "Play walkthrough"}
                variant="outline"
                disabled={stopped || state.mode === "approval"}
                onClick={() => dispatch({ type: state.mode === "playing" ? "pause" : "play" })}
              >
                {state.mode === "playing" ? (
                  <Pause data-icon="inline-start" />
                ) : (
                  <Play data-icon="inline-start" />
                )}
                {state.mode === "playing" ? "Pause" : "Play"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch({ type: "previous" })}
              disabled={state.stage === 0}
            >
              <ChevronLeft aria-hidden />
              <span className="sr-only">Previous stage</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch({ type: "next" })}
              disabled={stopped || state.mode === "approval" || state.mode === "complete"}
            >
              <ChevronRight aria-hidden />
              <span className="sr-only">Next stage</span>
            </Button>
            <Button type="button" variant="ghost" onClick={() => dispatch({ type: "replay" })}>
              <RotateCcw aria-hidden />
              <span className="sr-only">Replay</span>
            </Button>
          </div>
          <p className="aic-control-note">
            {reducedMotion
              ? "Reduced motion. Explore each stage with the controls."
              : "Pause or inspect a stage at any time."}{" "}
            Demo only. No credits are used.
          </p>
          <div className="aic-scene-context">
            <span>
              {scenario.id === "attendance-check"
                ? "North Campus only. Other campuses excluded."
                : "North, Central and South campuses."}
            </span>
            <span>
              {state.stage < 4
                ? "Institutional records remain unread."
                : stopped
                  ? "Execution stopped."
                  : "Approved records only. Read-only analysis."}
            </span>
          </div>
        </div>
        <details className="aic-evidence-details">
          <summary>Inspect the records and calculation</summary>
          <StageEvidence scenario={scenario} state={state} />
        </details>
        {state.mode === "approval" && (
          <div className="aic-approval">
            <p>
              <strong>
                {scenario.quotedAic === null
                  ? "AIC quote shown before execution"
                  : `${scenario.quotedAic} AIC for this complete operation`}
              </strong>
            </p>
            <p>One objective, its permitted records and one approved charge.</p>
            <Button
              type="button"
              onClick={() => dispatch({ type: "approve", autoplay: !reducedMotion })}
              disabled={state.boundary === "scope-unapproved"}
            >
              Continue example
            </Button>
            <p>Demo only. No credits are used.</p>
          </div>
        )}
        {boundaryMessage && <p className="aic-boundary-message">{boundaryMessage}</p>}
        {stopped && state.boundary === "platform-failure" && (
          <Button type="button" variant="outline" onClick={() => dispatch({ type: "retry" })}>
            Retry example
          </Button>
        )}
        {state.stage === 7 && state.mode === "complete" && (
          <div className="aic-operation-receipt">
            <Check aria-hidden />
            <p>
              <strong>One approved charge</strong>
              <span>
                The table, chart, summary and first render belong to this operation. Reopening or
                sorting this answer adds no AIC charge.
              </span>
            </p>
          </div>
        )}
      </section>
      <p className="sr-only" role="status" aria-live="polite">
        {scenario.label}. {current.label}.{" "}
        {state.mode === "approval"
          ? "Awaiting example approval."
          : state.mode === "blocked"
            ? boundaryMessage
            : state.mode === "complete"
              ? "Answer ready. One approved charge."
              : current.caption}
      </p>
      <details className="aic-sample-details" open={state.mode === "complete"}>
        <summary>Inspect sample answer</summary>
        <ScenarioAnswer scenario={scenario} empty={state.boundary === "zero-matches"} />
      </details>
      <details className="aic-stage-outline">
        <summary>All operation stages</summary>
        <ol className="aic-stage-sequence" aria-label="Operation stages">
          {aicStages.map((stage, index) => (
            <li
              key={stage.id}
              aria-current={index === state.stage ? "step" : undefined}
              data-complete={index < state.stage}
            >
              <span>{index + 1}</span>
              {stage.label}
            </li>
          ))}
        </ol>
      </details>
      <details className="aic-safeguards">
        <summary>Scope, sources and safeguards</summary>
        <dl>
          <div>
            <dt className="aic-source-label">Policy source</dt>
            <dd className="aic-source-value">{scenario.policy.id}, authored sample</dd>
          </div>
          <div>
            <dt className="aic-source-label">School records</dt>
            <dd>Sample term and authorised campuses only. No live service is contacted.</dd>
          </div>
        </dl>
        <label htmlFor="aic-boundary">Explore a boundary</label>
        <select
          id="aic-boundary"
          value={state.boundary}
          onChange={(event) =>
            dispatch({ type: "boundary", boundary: event.target.value as AicBoundary })
          }
        >
          <option value="normal">Normal example</option>
          <option value="access-denied">Access denied</option>
          <option value="scope-unapproved">Unapproved scope</option>
          <option value="missing-policy">Missing school policy</option>
          <option value="platform-failure">Platform failure</option>
          <option value="zero-matches">Valid answer with no matches</option>
        </select>
        <p>
          Access denials and platform failures have no AIC charge. A changed objective or scope
          receives a fresh quote. Suggested follow-ups remain human decisions.
        </p>
      </details>
    </div>
  );
}

export function AicWalkthrough() {
  const [open, setOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [scenarioId, setScenarioId] = useState<AicScenarioId>("attendance-check");
  useEffect(() => setEnhanced(true), []);
  return (
    <section className="aic-walkthrough" id="aic-examples" data-enhanced={enhanced}>
      <h3>What uses AIC?</h3>
      <p>
        Ask AEGIS to analyse your institution’s records. See the scope and credit charge before it
        runs. The resulting table, chart and summary belong to one complete operation.
      </p>
      <div className="aic-example-triggers">
        {aicScenarios.map((scenario) => (
          <Button
            key={scenario.id}
            type="button"
            variant="outline"
            className="aic-example-card"
            aria-label={scenario.label}
            aria-haspopup="dialog"
            onClick={() => {
              setScenarioId(scenario.id);
              setHasOpened(true);
              setOpen(true);
            }}
          >
            <MotionPoster
              asset={motionAssets[`aic-${scenario.id}`]}
              alt=""
              className="aic-example-poster"
            />
            <span className="aic-example-card-copy">
              <span className="aic-example-card-title">{scenario.label}</span>
              <span className="aic-example-card-summary">{aicScenarioSummaries[scenario.id]}</span>
              <span className="aic-example-card-action">
                <Play aria-hidden />
                Explore the example
              </span>
            </span>
          </Button>
        ))}
      </div>
      <details className="aic-charge-rules" data-md-include>
        <summary>One quote for the complete operation</summary>
        <p>
          AEGIS calculates comparable figures, identifies changes and produces the chart and summary
          as one analytical operation.
        </p>
        <p>
          If you accept a <strong>2-AIC quote</strong>, the completed operation costs{" "}
          <strong>2 AIC</strong>, including its table, chart and summary.
        </p>
        <ul>
          <li>Reopening the answer or sorting its returned table uses no additional AIC.</li>
          <li>A new analysis or changed scope receives a fresh quote.</li>
          <li>Access denials and platform failures have no AIC charge.</li>
          <li>Sending SMS, email or WhatsApp messages uses the separate communication wallet.</li>
        </ul>
      </details>
      <details className="aic-static-examples" data-md-include>
        <summary>Read the three sample answers</summary>
        <p>
          Illustrative walkthrough. Sample data. AIC quote shown before execution. One approved
          charge covers the complete answer.
        </p>
        {aicScenarios.map((scenario) => (
          <ScenarioAnswer key={scenario.id} scenario={scenario} />
        ))}
      </details>
      {hasOpened && (
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="One question. A complete analytical answer."
          closeLabel="Close AEGIS walkthrough"
          className="aic-walkthrough-sheet"
        >
          {open && <WalkthroughPlayer initialScenario={scenarioId} />}
        </BottomSheet>
      )}
    </section>
  );
}
