<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fairhelm Systems marketing platform

- `@fairhelm/ui` belongs to Fairhelm Systems, with SquareCampus's iterated design/mobile behaviour as its baseline. All marketing apps consume it; keep product copy and data outside UI.
- Apps build independently. Do not introduce imports between apps or duplicate shared navigation, themes or backgrounds.
- Preserve the SquareCampus claims, content, legal-copy, machine-readability and social-preview gates and Fairhelm's equivalent checks.
- Use Bun and the root dependency catalog; run `bun install` at the root and commit the single root lockfile with dependency changes.
- Current apps are SquareCampus, Fairhelm, Blogs, Legal and Press. Careers remains a possible future extraction. Legal documents retain their reviewed wording and explicit company/product scope; preserve the migration redirects.
- Blog canonicals use `blogs.squarecampus.com`; configure real HTTP redirects at the edge when deploying static exports.
