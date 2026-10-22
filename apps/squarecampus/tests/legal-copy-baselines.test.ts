import { createHash } from "node:crypto";
import { publishedLegalCopyStatus } from "../scripts/legal-copy-baselines";
import { assert, suite, test } from "./harness";

suite("published legal copy baseline");

const document = {
  url: "https://squarecampus.com/terms-of-service/",
  markdown: "# Terms of Service\n\nPublished legal wording.\n",
};
const baseline = {
  [document.url]: createHash("sha256").update(document.markdown).digest("hex"),
};

test("accepts the exact published document without editing its text", () => {
  assert.equal(publishedLegalCopyStatus(document, baseline), "unchanged");
});

test("requires review when any legal wording changes", () => {
  assert.equal(
    publishedLegalCopyStatus(
      { ...document, markdown: `${document.markdown}New clause.\n` },
      baseline
    ),
    "changed"
  );
});

test("does not exempt marketing routes or a different origin", () => {
  for (const url of [
    "https://squarecampus.com/pricing/",
    "https://example.com/terms-of-service/",
  ]) {
    assert.equal(publishedLegalCopyStatus({ ...document, url }, baseline), "not-pinned");
  }
});
