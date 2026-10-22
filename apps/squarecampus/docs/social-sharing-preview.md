# Social-sharing previews

## Diagnosis

The pre-change live homepage was checked on 22 October 2026 with `Mozilla/5.0`
and `Twitterbot/1.0`. Both returned HTTP 200 and exactly one
`twitter:card=summary_large_image`. The previous `/og/home.png` returned HTTP 200,
`image/png`, and decoded at 1200 × 630 (96,748 bytes). Robots allowed public pages
and images, disallowing only `/api/`. Neither a missing card tag nor a missing
image was demonstrated. The cause of the reported image-less X preview remains
unconfirmed; actual X crawler access and rendering were not observed.

The homepage inherits social metadata from `src/app/layout.tsx`; its own
`src/app/page.tsx` changes only SEO title, description and alternates. No
`opengraph-image` or `twitter-image` file overrides were found. The root and
`createPageMetadata()` now use shared, platform-specific artwork defaults while
explicit route/article images remain intact. Existing social copy, canonical-base
overrides, JSON-LD, robots, redirects and security controls are preserved.

## Artwork

The supplied PNG is opaque RGB, 1774 × 887, exactly 2:1. Sharp, already installed
by Next.js, resizes the complete artwork proportionally to 1200 × 600. OG adds
15 pixels above and below in `#021c41`, sampled from the source's top-left navy.
JPEG quality is 92 with 4:4:4 chroma subsampling. Both outputs were visually
inspected; the lettering, website address and Fairhelm Systems attribution are
intact. No cropping, stretching or image generation is involved.

| Platform | Public URL | Dimensions | Bytes |
| --- | --- | --- | ---: |
| OG | https://squarecampus.com/social/squarecampus-og-v1.jpg | 1200 × 630 | 261,024 |
| X | https://squarecampus.com/social/squarecampus-x-v1.jpg | 1200 × 600 | 257,068 |

Regenerate using the original attachment:

```sh
bun scripts/social-images.mjs /absolute/path/to/wide_landscape_tech_education_branding_hero_banner.png
```

For later revisions, update the version in both generator and metadata; do not
replace v1 with different artwork under the same filename.

## Verification

`bun run build` includes the new `scripts/check-social-preview.ts` gate through
`check:build`, in addition to every existing check. It uses the existing test
harness and HTTP-serves the actual `out/` export without an HTML fallback. It maps
emitted production image paths to that local server, so local tests never fetch
the previous live deployment accidentally. No cookies or JavaScript are required.

The 28 checks cover seven representative routes: home, pricing, services, a
generated search-intent page, an article, Enterprise and a shared-default route. They verify
canonical URLs, exactly one effective card/image tag, preserved homepage SEO and
social copy, image dimensions/type/alt, JSON-LD presence and parsing, robots rules,
and full image decoding from HTTP 200 responses. Local assets must match the
export and source bytes. The gate failed eight checks against the old export and
passed all 26 against the changed social-only production build. With Enterprise
coverage added, the final suite contains 28 checks.

Before the separately authorised commercial integration, a before/after check
of all 72 HTML files found zero changes to visible text, JSON-LD, titles,
descriptions, canonicals or alternates from the social-only fix.

Representative tags from the tested homepage export:

```html
<meta property="og:url" content="https://squarecampus.com/"/>
<meta property="og:image" content="https://squarecampus.com/social/squarecampus-og-v1.jpg"/>
<meta property="og:image:type" content="image/jpeg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="@squarecampushq"/>
<meta name="twitter:image" content="https://squarecampus.com/social/squarecampus-x-v1.jpg"/>
```

Both image alt tags read: “SquareCampus School Operating System — Run every
campus. Govern them as one. Connected campuses by Fairhelm Systems.”

## Deployment and post-deployment checks

1. Use the existing S3/CloudFront deployment script in `DEPLOYMENT.md`, with the
   real intake endpoint. An email-mode local test build is not a release build.
   The JPEGs are copied into `out/social/` and uploaded in the existing non-hashed
   asset pass, with revalidation enabled. The script invalidates CloudFront and
   waits for completion. Preserve the edge security policy, API behaviour and
   publication gates.
2. After invalidation, run the same checks against actual production responses:

   ```sh
   SOCIAL_PREVIEW_ORIGIN=https://squarecampus.com bun scripts/check-social-preview.ts
   ```

   All 28 must pass. Remote mode does not require a local `out/` directory.
3. Inspect GET headers for both new JPEG URLs with a browser UA and Twitterbot:
   HTTP 200, `Content-Type: image/jpeg`, no authentication/challenge, existing
   security headers. Compare downloaded SHA-256 values with the corresponding
   local JPEGs to establish CDN freshness; an HTML 200 fallback is a failure.
4. Inspect the raw homepage HTML for the tags above and both image alt tags, with
   no stale `/og/home.png` social tag. Check representative page-specific images
   and route canonicals using the gate.
5. Use `curl -sS -D - -o /dev/null URL` to check HTTP-to-HTTPS and canonical-host
   redirects for `www.squarecampus.com`, `squarecampus.in`, and
   `www.squarecampus.in`. Follow them to confirm a final HTTPS 200 and no loop.
6. Inspect CDN/origin logs for real X crawler requests if access is available.
   A spoofed Twitterbot request is only a smoke test and does not prove actual X
   reachability. Inspect X's preview tooling/composer without publishing a post
   and record that rendering independently.
7. CDN invalidation and X preview caching are separate. Old posts may keep cached
   cards; query parameters do not guarantee a purge or an immediate refresh.
