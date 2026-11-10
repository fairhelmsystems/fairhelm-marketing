import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { motionAssets } from "../src/content/motion-assets";
import {
  aicScenarios,
  calculateScenario,
  initialWalkthrough,
  walkthroughReducer,
} from "../src/lib/aic-walkthrough";
import { assert, suite, test } from "./harness";

suite("Illustrative AIC operation");

test("authored sample answers calculate the exact attendance, finance and policy results", () => {
  const attendance = calculateScenario(aicScenarios[0]);
  assert.deepEqual(attendance.matchedIds, [...aicScenarios[0].expected.matchedIds]);
  assert.deepEqual(
    attendance.rows.map((row) => row.cells[1]),
    ["75%", "80%", "83.75%"]
  );
  assert.ok(!attendance.rows.some((row) => row.id === "sample-student-d"));
  const fees = calculateScenario(aicScenarios[1]);
  assert.equal(fees.totalPaise, aicScenarios[1].expected.totalOutstandingPaise);
  assert.deepEqual(
    fees.bars.map((bar) => bar.value),
    [25000000, 15000000, 8000000]
  );
  assert.deepEqual(fees.footer, ["Total", "₹30,00,000", "₹1,00,000", "₹24,20,000", "₹4,80,000"]);
  const review = calculateScenario(aicScenarios[2]);
  assert.deepEqual(review.matchedIds, [...aicScenarios[2].expected.matchedIds]);
  assert.deepEqual(review.incompleteIds, [...aicScenarios[2].expected.incompleteIds]);
  assert.equal(review.rows[3].finding, "outside");
  assert.deepEqual(review.rows[0].metrics, {
    attendancePercent: 75,
    thresholdPercent: 85,
    declinePoints: 14,
  });
  assert.equal(review.rows[3].metrics?.attendancePercent, review.rows[3].metrics?.thresholdPercent);
  assert.equal(review.rows[4].metrics?.declinePoints, null);
  assert.equal(review.rows[4].cells[3], "Unavailable");
  assert.ok(aicScenarios.every((scenario) => scenario.quotedAic === null));
});

test("every scenario stops at approval and settles only after a complete permitted answer", () => {
  for (const scenario of aicScenarios) {
    let state = initialWalkthrough(scenario.id);
    for (let index = 0; index < 20; index++)
      state = walkthroughReducer(state, { type: "next", autoplay: true });
    assert.equal(state.stage, 3);
    assert.equal(state.mode, "approval");
    assert.equal(state.approved, false);
    state = walkthroughReducer(state, { type: "approve", autoplay: false });
    assert.equal(state.stage, 4);
    for (let index = 0; index < 20; index++) state = walkthroughReducer(state, { type: "next" });
    assert.equal(state.stage, 7);
    assert.equal(state.mode, "complete");
    assert.equal(walkthroughReducer(state, { type: "approve", autoplay: true }), state);
    state = walkthroughReducer(state, { type: "scenario", id: "attendance-check" });
    assert.deepEqual(state, initialWalkthrough("attendance-check"));
  }
});

test("access, policy, scope and platform boundaries cannot bypass their stop", () => {
  for (const [boundary, stop] of [
    ["access-denied", 1],
    ["missing-policy", 2],
    ["scope-unapproved", 3],
    ["platform-failure", 5],
  ] as const) {
    let state = walkthroughReducer(initialWalkthrough("attendance-check"), {
      type: "boundary",
      boundary,
    });
    for (let index = 0; index < 20; index++) {
      state = walkthroughReducer(state, { type: "next" });
      state = walkthroughReducer(state, { type: "approve", autoplay: false });
    }
    assert.equal(state.stage, stop);
    assert.equal(state.mode, boundary === "scope-unapproved" ? "approval" : "blocked");
    assert.equal(walkthroughReducer(state, { type: "play" }), state);
    if (boundary === "platform-failure") {
      state = walkthroughReducer(state, { type: "retry" });
      assert.equal(state.stage, 4);
      assert.equal(state.approved, true);
      assert.equal(state.boundary, "normal");
    }
  }
});

test("rendered AIC stories carry contiguous stages and valid immutable media", () => {
  for (const scenario of aicScenarios) {
    const asset = motionAssets[`aic-${scenario.id}`];
    assert.equal(asset.width, 960);
    assert.equal(asset.height, 720);
    assert.equal(asset.segments.length, 8);
    let nextFrame = 0;
    for (const segment of asset.segments) {
      assert.equal(segment.startFrame, nextFrame);
      assert.ok(segment.durationInFrames > 0);
      nextFrame += segment.durationInFrames;
    }
    assert.equal(nextFrame, asset.durationInFrames);
    for (const source of [asset.light, asset.dark]) {
      for (const segment of asset.segments) assert.ok(source.stills[segment.id]);
      const paths = new Set([source.poster, source.mp4, ...Object.values(source.stills)]);
      for (const path of paths) {
        const bytes = readFileSync(new URL(`../public${path}`, import.meta.url));
        assert.ok(bytes.length > 0, path);
        const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
        assert.ok(path.includes(`.${digest}.`), path);
      }
    }
  }
});
