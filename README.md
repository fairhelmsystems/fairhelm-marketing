# Fairhelm Marketing

> Public source mirror of Fairhelm Systems’ marketing platform. Production deployment tooling, AWS account configuration, credentials and release records stay private.

The company-owned marketing platform for **Fairhelm Systems** and its products. Bun workspaces and Turborepo run independently deployable Next.js apps around one shared design system, extracted from the iterated SquareCampus site.

| App | Public host | Development | Static preview |
| --- | --- | --- | --- |
| `apps/squarecampus` | `squarecampus.com` | `localhost:3000` | `localhost:3100` |
| `apps/fairhelm` | `fairhelmsystems.com` | `localhost:3002` | `localhost:3102` |
| `apps/blogs` | `blogs.squarecampus.com` | `localhost:3001` | `localhost:3101` |
| `apps/legal` | `legal.fairhelmsystems.com` | `localhost:3003` | `localhost:3103` |
| `apps/press` | `press.fairhelmsystems.com` | `localhost:3004` | `localhost:3104` |

```sh
bun install --frozen-lockfile
bun run dev
```

Run one app with `bun run dev:squarecampus`, `bun run dev:fairhelm`, or `bun run dev:blogs`. Development navigation uses the local SquareCampus/blog ports; canonical metadata always uses public production hosts. Company navigation uses `localhost:3002` during development; `NEXT_PUBLIC_FAIRHELM_URL` can override it.

```sh
bun run check:workspace
bun run check-types
bun run test
bun run lint
NEXT_PUBLIC_CONTACT_FORM_MODE=email bun run build
bun run check:links    # re-run the offline link, fragment, redirect and asset graph
```

The email mode is an explicit local/CI interim state for SquareCampus enquiries. Production should set `NEXT_PUBLIC_CONTACT_ENDPOINT` to its intake endpoint instead. It is never silently defaulted. Copy `apps/squarecampus/.env.example` to `.env.local` in that app for local configuration. Fairhelm's existing enquiry journey prepares an email draft.

Builds preserve the original claims, legal-copy, content, Markdown, machine-readability and social-preview checks, and add migration checks, canonical page checks and an offline cross-app link/asset audit. Each app exports its own `out/`. Run `bun run preview:squarecampus`, `bun run preview:fairhelm`, and `bun run preview:blogs` in separate terminals to exercise the actual edge redirect handler locally.

Browser/mobile and Lighthouse tooling lives in [`tools/quality`](tools/quality/README.md). `bun run quality:plan` and `bun run quality:list` inspect the prepared matrix without launching a browser. Actual browser runs and visual review remain pending while the saved localhost access policy blocks them.


## Ownership and boundaries

- **`@fairhelm/ui`** owns the Fairhelm Systems design system: the SquareCampus-tested primitives, navigation, responsive composition, surfaces, typography, light/dark theme, reduced-motion behaviour, device frames, and shared backgrounds. It contains no product content or imports from apps.
- **`@fairhelm/config`** owns public origins, local navigation overrides and canonical URL helpers.
- **`@fairhelm/squarecampus-content`** owns SquareCampus commercial facts, company disclosure and the existing typed articles. Product content stays separate from the company UI.
- **`@fairhelm/fairhelm-content`** owns company facts, existing company legal section data, and six Markdown practice notes with cover metadata.
- **`@fairhelm/content-tools`** owns the original HTML-to-Markdown converter shared by the marketing and Legal builds.
- **`@fairhelm/typescript-config`** owns common TypeScript settings.
- **`tools/motion`** retains the independent Remotion toolchain; it renders into SquareCampus assets and does not enter app browser bundles.

Shared dependency versions live in the root Bun catalog, copied from the source SquareCampus installation. Applications declare only the packages they use. Remotion keeps its own compatible versions. There is one root `bun.lock` and isolated dependency installs.

This mirror contains the shared design system, five applications and their build and content checks. Changes flow one way from the private company workspace.

See [the design system guide](packages/ui/README.md), [architecture and SEO decisions](docs/architecture.md). Existing source code remains Apache-2.0; content and marks retain their original ownership under [NOTICE](NOTICE).

## Public source mirror

The public source mirror is `https://github.com/fairhelmsystems/fairhelm-marketing`. It receives a fresh, signed source snapshot after successful main-branch validation. Publication excludes private Git history, deployment tooling, AWS account configuration, release records and local files. Public apps, shared packages, content checks and the generic redirect handler remain buildable together.

`scripts/export-public.ts` defines the publication allowlist, removes deployment commands from the public manifest and regenerates its Bun lockfile. The mirror workflow scans exactly that snapshot with a pinned secret scanner before writing through a deploy key scoped to the mirror repository. Older validation runs cannot overwrite a newer main revision. Production credentials and the mirror key stay in private repository settings.
