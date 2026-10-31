import { judgeSubmission, MIN_FILL_MS } from "@fairhelm/ui/lib/form-guard";
import { assert, suite, test } from "./harness";

suite("form guard");

test("a filled honeypot is automated regardless of timing", () => {
  assert.equal(judgeSubmission({ honeypot: "x.com", openedAt: 0, now: 60_000 }), "automated");
  assert.equal(judgeSubmission({ honeypot: " ", openedAt: 0, now: 60_000 }), "ok");
});

test("a submission faster than a person can fill the form is held, not discarded", () => {
  assert.equal(judgeSubmission({ honeypot: "", openedAt: 0, now: MIN_FILL_MS - 1 }), "too-fast");
  assert.equal(judgeSubmission({ honeypot: "", openedAt: 0, now: MIN_FILL_MS }), "ok");
});
