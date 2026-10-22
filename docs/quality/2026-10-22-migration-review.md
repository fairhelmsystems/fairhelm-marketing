# Marketing migration review — 22 October 2026

## Verified without a browser

The following extracted UI modules match the original SquareCampus source after ignoring import paths and whitespace:

- Configurable marketing header and desktop/mobile navigation.
- Smartphone `MobileExpand` and Base UI bottom-sheet implementation.
- Responsive `SectionShell`, device frames and reduced-motion-aware reveal implementation.

The six original responsive typography definitions (`type-display`, `type-page-title`, `type-section-title`, `type-card-title`, `type-body`, `type-support`) match the original stylesheet. These are **source parity checks**, not visual screenshot comparisons.

All **83 canonical HTML pages** in the three production exports pass the new `bun run check:pages` guard: one H1, one main landmark, en-IN document language, mobile viewport, canonical matching its sitemap URL, image alt attributes, existing local image files, and intrinsic dimensions or absolute fill positioning. This guard runs after the root build.

Application-level adjustments in this pass:

- Fairhelm's two engineering links use the shared disclosure group, reducing top-level header crowding while retaining both destinations in desktop and smartphone navigation. Actual rendered fit still needs browser verification.
- The Journal uses the shared marketing CTA in both desktop and smartphone navigation; the demo action is available in the phone menu too.
- SquareCampus's shared header/drawer/section implementations and typography remain unchanged.

## Pending browser evidence

Visual/mobile interaction checks and Lighthouse runs could not execute. The browser origin approval gate rejected `http://localhost:3100` with: **“A saved user permission setting blocks this action”**, citing a saved permission or managed policy. This remained blocked after renewed user authorization. No alternate browser surface, headless browser, remote runner, port or hostname was used to bypass that denial.

Consequently this review makes no claim about rendered overflow, drawer focus/swipe behaviour, screenshots, Lighthouse scores or Core Web Vitals. Build/source results are not substitutes for those browser measurements.

Once the saved origin setting is unblocked, verify all three apps at phone (360/390px), tablet (768px), compact desktop (1024px) and desktop (1440px) widths; exercise keyboard navigation, mobile menus, section drawers, theme persistence and reduced motion. Then run mobile/desktop Lighthouse against production exports, preserving reports and comparing SquareCampus with its original build. Repeat a run when scores vary before assigning a regression to code.
