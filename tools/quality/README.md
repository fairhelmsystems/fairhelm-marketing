# Browser and Lighthouse verification

This workspace tests **production exports** of SquareCampus, Fairhelm Systems, Fairhelm Journal, Legal and Press. It is separate from the ordinary build/test pipeline. Browser runs are explicit commands and are not triggered by pushes, PRs or `turbo run test`.

## Evidence status — 22 October 2026

The harness has been type-checked, its test cases enumerated without starting a server or browser, and its report-summary logic unit-tested. **The browser scenarios and Lighthouse audits have not run. There are no measured scores or reviewed screenshots.** Localhost browser access is currently denied by a saved browser permission/managed policy. This tooling must not be used as a way around that restriction; execute it only once browser access is available.

## Preparation without browser access

```sh
bun install --frozen-lockfile
bun run quality:plan
bun run quality:list
bun run --cwd tools/quality check-types
bun run --cwd tools/quality test
```

Playwright and Lighthouse need Node.js 22.19 or newer. When `node` is not on PATH, set `NODE_BINARY` to the Node executable for both runners. Bun owns dependency installation and orchestration; the browser tools execute under Node. Use that same executable in place of `node` for the one-time browser-install command below.

## When browser access is available

First produce clean exports. Default cross-site links must keep their public canonical destinations; do not rebuild with local URLs just to make assertions pass.

```sh
NEXT_PUBLIC_CONTACT_FORM_MODE=email bun run build
# Install the Playwright browser once, if absent:
node tools/quality/node_modules/@playwright/test/cli.js install chromium
bun run quality:browser
```

The browser command starts the existing static preview servers at `localhost:3100`, `3101`, `3102`, `3103` and `3104`, using the production edge handler. Outside CI it can reuse servers already running on those ports: ensure they serve the latest exports and restart them if the edge handler changed. The runner does not alter contact configuration, deploy infrastructure or submit forms.

The matrix covers 20 representative routes at 360, 390, 768, 1024 and 1440px, including legal pages, forms, pricing, article listings and long articles. It checks:

- HTTP status, canonical metadata, a single main landmark and unhandled page errors.
- Horizontal overflow and full-page dark/light captures, using reduced motion.
- Mobile navigation, desktop disclosures and keyboard Escape/focus return.
- Keyboard skip links and theme persistence across reloads.
- Phone section drawers, focus containment/return and release of body scroll locking. Inline layouts skip the drawer scenario.

The HTML report, JSON results, screenshots and failure traces are written under `artifacts/browser/`. Screenshots are **review evidence**, not approved baselines; inspect typography, spacing, cropped graphics, header fit, article readability and drawer usability before declaring visual parity. Emulation does not replace a real touch-device review. No form submission is automated.

For Lighthouse, keep the same five preview servers running in separate terminals:

```sh
bun run preview:squarecampus
bun run preview:blogs
bun run preview:fairhelm
bun run preview:legal
bun run preview:press
# In another terminal, with a supported Chrome/Chromium installed:
bun run quality:lighthouse
```

Lighthouse's CLI discovers Chrome; use `CHROME_PATH` for an installed supported Chromium binary if needed. Each homepage runs three times in mobile and desktop mode, sequentially. `LIGHTHOUSE_RUNS` accepts 3–9 runs. JSON and HTML reports plus a median score/metric summary go to a timestamped `artifacts/lighthouse/` directory. Missing scores, browser runtime errors, unexpected navigation and failed runs produce a failed summary/exit code. LCP and TBT are milliseconds; CLS is unitless. Reports retain the Lighthouse version and raw evidence. No performance budget is claimed before the first measurements.

Local lab audits do not measure deployed CDN/cache/compression behaviour, production security headers, DNS redirects or field Core Web Vitals. Review those after deployment. Never treat generated captures, test enumeration or passing static checks as completed browser/Lighthouse verification.

References: [Next.js production testing guidance](https://nextjs.org/docs/app/guides/testing/playwright), [Playwright configuration](https://playwright.dev/docs/test-configuration), [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).
