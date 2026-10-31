# Contact intake: human check contract

The SquareCampus and Fairhelm contact forms share one client, `HumanCheck`
(`packages/ui/src/components/human-check.tsx`). It only presents what the intake
service gives it. This page is the contract that service must meet. The service
is not in this repository, so nothing here is enforced until it is built.

Client-side signals (honeypot, minimum fill time, the behaviour trace below) are
evidence for the service to weigh. They are readable and forgeable in devtools,
and a script that POSTs straight to the endpoint never runs them. The service is
the only place a decision can be made.

## Endpoints

The challenge base is derived from the intake endpoint, never configured:

| Site | Intake endpoint | Challenge base |
| --- | --- | --- |
| SquareCampus | `<origin>/api/contact` | `<origin>/api/challenge` |
| Fairhelm | `https://api.fairhelmsystems.com/inquiries` | `https://api.fairhelmsystems.com/challenge` |

Fairhelm's form only calls the endpoint when `NEXT_PUBLIC_FAIRHELM_CONTACT_ENABLED=true`.
Do not enable that until `/challenge` exists, or visitors will be stopped at the
check with an error panel.

## `POST {base}` — issue a board

Request: `{ "theme": "light" | "dark" }`

| Status | Meaning | Client behaviour |
| --- | --- | --- |
| 200 | Board issued | Shows the board |
| 503 with `{ "error": "human check unavailable" }` | Check not enforced (no secret configured) | Skips the check and submits without a token |
| Other 503 | Service unavailable or unrecognised response | Shows a retry panel with the email address |
| 429 | Too many boards from this connection | Shows the "email us" panel |
| other | Failure | Shows a retry panel with the email address |

200 body: `{ id, image, width, height, start: {x, y}, tolerance }`. `image` is a data
URI. The answer must never appear in the response: no target coordinates, no
list of candidate dots.

The service may also return `instructions: { title, help, tileLabel }` as plain text
for the board family. The shared client uses these for the visible heading, help
text and tile accessibility label. Each string must be non-empty, contain no
control characters and fit the respective 120/300/240 character limits. Older
wire boards may omit the object and retain the existing wire instructions.

## `POST {base}/solve` — mark an answer

```json
{
  "id": "<board id>",
  "x": 212,
  "y": 140,
  "behaviour": {
    "via": "pointer",
    "thinkMs": 1840,
    "dragMs": 960,
    "trace": [{ "x": 40, "y": 220, "t": 0 }, { "x": 52, "y": 214, "t": 18 }]
  }
}
```

- `via` is `pointer` or `keyboard`. A keyboard answer records no pointer
  samples, so `trace` is empty. Do not fail keyboard answers for a missing
  trace; this is the accessible route.
- `thinkMs`: board shown to first interaction. `dragMs`: first interaction to
  answer. `trace`: at most 64 points, `t` in ms from drag start.

Responses: `{ ok: true, pass: "<token>" }`, `{ ok: false }`, `{ ok: false, expired: true }`
(the client then loads a fresh board), or 429 (blocked panel).

## Rules the service must enforce

1. **One guess per board.** Delete the board on the first `/solve`, right or wrong.
2. **Short expiry** on boards (about 2 minutes) and single-use pass tokens
   (about 5 minutes), signed, and bound to the board id.
3. **Rate limit** boards and solves per connection; return 429.
4. **Accept the intake submission only with a valid `humanToken`** when the check
   is enforced. A missing or reused token is rejected. When no secret is
   configured, `/challenge` returns 503 and intake accepts submissions as before;
   keep those two states in step.
5. **Honeypot:** Fairhelm sends `company_website`. A non-empty value is a bot:
   return success and discard. SquareCampus drops honeypot hits in the browser
   and strips the field from the payload.
6. **Idempotency:** Fairhelm sends `idempotencyKey`; repeated keys must not create
   duplicate leads.

## Making the check unpredictable

Everything the browser sees can be read, so variety and scoring belong here.

- **Vary the board.** Randomise the number of wires, crossings, wire curvature,
  dot count, decoy dots, tile start position, noise and palette per board. Never
  reuse a layout. Rotate challenge families (for example trace the wire, then
  order three labelled nodes) and add families server-side without a client
  release, as long as the answer remains a single point.
- **Adapt difficulty.** Raise it on any of: repeated boards from one connection,
  a failed solve, a datacentre or anonymising-proxy address, or a suspicious
  `behaviour` score. Keep the common case a single quick board.
- **Score behaviour** (pointer answers only) and combine it with correctness:
  - near-zero `thinkMs`, or `dragMs` under roughly 250 ms;
  - fewer than a handful of trace points, or all points on one straight line;
  - constant speed (near-zero variance in distance over `t`);
  - a trace that starts exactly at `start` and ends exactly on the answer with
    no overshoot or correction;
  - identical traces across different boards.
  Treat a poor score as a reason to serve a harder board, not as a silent
  rejection, so a real visitor with an unusual device can still get through.
- **Never reveal why** a board failed beyond "not quite" or "timed out".

## Not covered

Server-side verification of `humanToken` for Fairhelm, board generation, and the
scoring above are all unbuilt as far as this repository shows. Nothing in the
client changes when the service adds variety or tightens scoring.

## Releasing API-enabled Fairhelm

Once the public API hostname serves valid TLS and passes browser CORS checks,
set repository variable `FAIRHELM_CONTACT_ENABLED=true` and build on main. The
marketing CI workflow also accepts manual dispatch on main for a reviewed
configuration rebuild. Download the exact successful run's artifact, verify
its commit/checksums, and promote its Fairhelm archive; do not rebuild locally
or overwrite an existing immutable release prefix. Retain the previous release
and hashed assets for rollback and clients with cached HTML.
