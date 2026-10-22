# Export graph and redirect review — 22 October 2026

The offline audit covers **122 exported pages**, including legacy preview fallbacks, with **9,522 owned links/assets** and **6 generated stylesheets**. All targets and fragments resolve through the production edge handler to local exported files. Script data and comments are parsed as such rather than mistaken for links. CSS font/resource references are checked too. The separate canonical-page guard continues to cover 83 indexable HTML pages.

This audit reads local files and executes the edge handler in a VM. It makes no browser or network requests. HTML parsing uses [Bun's HTMLRewriter](https://bun.com/docs/runtime/html-rewriter).

## Fixed findings

- A relative slash-normalization redirect could resolve to a different origin for unusual incoming slash/backslash paths. The edge handler now normalizes separators before routing and issues a single safe canonical redirect. Tests exercise every canonical host, query preservation, article migrations and ordinary file paths.
- Existing Fairhelm skip-to-content fragments could survive article migration but land on Journal pages without the corresponding main-landmark ID. Journal pages now expose that ID, and the Journal and company app use the same focus-visible `SkipLink` component.
- Redirect loops, duplicate element IDs, missing local files and missing destination fragments now fail the root build. Root engineering scripts are included in TypeScript checks as well.

## Initial JavaScript size observation

These are **gzip level-9 estimates of JavaScript files referenced by each homepage's exported HTML**, measured from local production files. They are not observed network transfers, execution cost, Lighthouse scores or Core Web Vitals.

| Homepage | JS files | JS bytes | Estimated gzip bytes |
| --- | ---: | ---: | ---: |
| Original SquareCampus export | 10 | 656,805 | 203,929 |
| Migrated SquareCampus | 10 | 668,221 | 207,952 |
| Fairhelm | 11 | 683,283 | 212,580 |
| Journal | 9 | 633,065 | 196,319 |

The migrated SquareCampus estimate is 4,023 gzip bytes higher (about 1.97%); the referenced script count is unchanged. This is a recorded comparison, not a claim that runtime performance has improved or regressed. Rendered/mobile and Lighthouse verification remain pending the saved localhost browser-access policy described in the migration review.
