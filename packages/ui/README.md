# Fairhelm Systems design system

`@fairhelm/ui` is owned by Fairhelm Systems. SquareCampus is its first consumer, and its iterated desktop/mobile implementation is the baseline. Fairhelm and the shared publication consume the same source components and tokens.

Import individual modules so client boundaries remain local:

```tsx
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { GlyphField } from "@fairhelm/ui/backgrounds/glyph-field";
```

```css
@import "tailwindcss";
@import "@fairhelm/ui/styles.css";
```

The package stylesheet declares its Tailwind source explicitly so shared classes are generated in each app. Optional `@fairhelm/ui/compositions.css` exposes company-page aliases using the exact existing SquareCampus responsive type scales, plus article typography. It introduces no second palette.

| Module | Exports / responsibility |
| --- | --- |
| `components/button`, `badge`, `card`, `accordion`, `tabs`, `separator` | Original SquareCampus Base UI primitives |
| `components/input`, `checkbox`, `textarea`, `field`, `label`, `toggle`, `toggle-group`, `alert` | Form primitives needed by the Fairhelm app |
| `components/marketing` | Container, eyebrow, headings, CTA groups, panels, operational badges, metrics and comparison rows |
| `components/section-shell`, `button-link`, `details-faq` | Responsive section composition, marketing CTAs and accessible FAQ disclosures |
| `navigation/marketing-header`, `marketing-navigation`, `types` | Brand/data-driven desktop navigation, mobile menu and path handling |
| `components/reveal`, `tilt-stage` | Entrance/hover behaviour with reduced-motion handling |
| `components/mobile-expand`, `bottom-sheet` | Original inline desktop / lazy mobile drawer interaction |
| `components/device-frames` | Original responsive device framing |
| `components/skip-link` | Shared focus-visible skip link to the main landmark |
| `components/theme-script`, `theme-toggle` | No-flash dark default, persisted light/dark choice |
| `backgrounds/glyph-field`, `footer-background` | Shared decorative backgrounds; configurable glyph vocabulary |
| `hooks/useReducedMotion`, `lib/utils` | Motion preference and class merging |

Keep product logos, site navigation data, copy, schemas, pricing and product mockups in their app/content package. Pass vocabulary to `GlyphField` when product-specific decoration is needed: SquareCampus passes its original school-operation tokens, retaining its exact rendering behaviour.

New sites depend on this package and use its existing responsive components before introducing new ones. Make shared fixes here; do not fork the header, mobile menu, theme or palette into another app. Verify changes against all three consumers. Keep client directives on interactive modules and avoid a barrel export that turns server composition into client code.
