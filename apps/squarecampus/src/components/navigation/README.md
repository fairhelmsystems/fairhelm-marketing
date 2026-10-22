# Marketing navigation

`MarketingHeader` composes `DesktopNavigation` and `MobileNavigation` with a
brand slot, desktop action and mobile actions. It accepts the current pathname
instead of owning a product's routing hook. Each site supplies its own
`NavigationItem[]`: links, descriptions, optional icon components, groups and an
optional group-footer link. No SquareCampus routes, branding or copy live here.

`src/components/site/navigation.ts` adapts SquareCampus content to this contract;
`SiteHeader` supplies the brand and CTAs. A different marketing site can use the
same components with a different adapter, brand and actions.

Desktop navigation uses disclosure buttons and ordinary links, with one open
group, mouse hover switching after opening, outside-click dismissal, Escape,
focus-leave dismissal and route-change dismissal. Mobile navigation shows grouped
links and closes through `onNavigate`, including same-page fragment links.
Descriptions and icons do not replace accessible link text.

The visual contract uses the existing semantic tokens: `--surface-menu`,
`--surface-strong`, `--surface`, `--surface-muted`, `--foreground`,
`--muted-foreground`, `--brand`, `--line`, and `--line-strong`, with existing
typography and radius tokens. The `.marketing-navigation` focus rules in
`globals.css` supply a subtle keyboard indicator without a blue mouse-click box.

When extracting a Turborepo package, move these components, their semantic tokens,
focus rules and the shared `cn()` utility together. React, Next.js, Lucide,
`clsx` and `tailwind-merge` are the current library dependencies. Configure the
consumer's Tailwind source discovery for the package. Creating a workspace,
publishing a package or changing the site's build system is intentionally a
separate migration.
