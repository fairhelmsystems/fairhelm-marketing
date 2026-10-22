# Architecture and URL ownership

This repository belongs to Fairhelm Systems. The design system derives from the carefully iterated SquareCampus implementation and is shared by every marketing app. Site-specific business content, navigation data and SEO metadata remain with the app or its content package.

## Current apps

SquareCampus retains its original routes, copy, claims checks, pricing, legal pages, mobile disclosures and product visuals. Fairhelm retains its existing company, services and legal content while adopting shared navigation, theme, typography, surfaces, primitives and backgrounds. Blogs is the only app that serves article content.

Legal and Press now publish at `legal.fairhelmsystems.com` and `press.fairhelmsystems.com`. Legal keeps company/service documents under `/fairhelm/` and SquareCampus documents under `/squarecampus/`; the documents retain their reviewed wording and scope. Original legal/press routes are noindex fallbacks with permanent HTTP redirects at the edge. Footer and form links point directly to their new destinations. Company identity and registered-office disclosures remain on the marketing sites.

The Journal now has accessible All stories / Fairhelm notes / SquareCampus stories tabs. Fairhelm cover metadata lives with the article source; image files are served by the Journal app, including when shown on Fairhelm.

Each app has its own build output, environment and future CloudFront distribution. Applications depend on packages; packages never import applications. Bun's isolated linker enforces declared dependency ownership. Turborepo hashes the dependency graph and public environment variables; build outputs include both `.next` and `out`.

## Shared publication

The canonical publication host is `https://blogs.squarecampus.com`, branded Fairhelm Journal.

| Source | Final URL |
| --- | --- |
| `squarecampus.com/blog/` | `blogs.squarecampus.com/` |
| `squarecampus.com/blog/<slug>/` | `blogs.squarecampus.com/<slug>/` |
| `squarecampus.com/blog/feed.xml` | `blogs.squarecampus.com/feed.xml` |
| `fairhelmsystems.com/insights/` | `blogs.squarecampus.com/fairhelm/` |
| `fairhelmsystems.com/insights/<slug>/` | `blogs.squarecampus.com/fairhelm/<slug>/` |
| `fairhelmsystems.com/insights/feed.xml` | `blogs.squarecampus.com/feed.xml` |
| Optional `blogs.fairhelmsystems.com/<path>` | `blogs.squarecampus.com/<path>` |

All moves use HTTP 301 at the edge and preserve query parameters. Legacy index/article exports are noindex preview safety nets, not a substitute for edge redirects. The canonical host renders one article per URL; old article URLs are excluded from marketing sitemaps. Navigation, related reading, RSS, canonical tags, Open Graph and JSON-LD point at final destinations. Product CTAs on blog articles point back to the relevant marketing app. Fairhelm notes retain Markdown alternates on their new URLs.

This setup follows Google's guidance to choose canonical URLs and use permanent redirects when moving content. It does not claim that hosting the same articles on two domains improves both domains' rankings. The product and company sites continue to have their own substantive, indexable content and relevant links into the publication. See [Google's canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [URL migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Future app: careers

Careers remains a possible future extraction. Keep its existing routes and reviewed copy until a complete migration is requested. Legal and Press are independent apps now, with their own hosts, certificates, S3 origins and CloudFront distributions.
