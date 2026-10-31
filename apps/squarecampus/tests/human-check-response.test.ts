import { isHumanCheckDisabled } from "@fairhelm/ui/lib/human-check-response";
import { assert, suite, test } from "./harness";

suite("human check outage handling");

test("only the legacy explicit disabled response allows a tokenless submission", () => {
  assert.equal(isHumanCheckDisabled({ error: "human check unavailable" }), true);
  assert.equal(isHumanCheckDisabled({ error: "temporarily unavailable" }), false);
  assert.equal(isHumanCheckDisabled(null), false);
  assert.equal(isHumanCheckDisabled({}), false);
});
