import { BookOpen } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingHeader } from "@fairhelm/ui/navigation/marketing-header";
import { MobileNavigation } from "@fairhelm/ui/navigation/marketing-navigation";
import type { NavigationItem } from "@fairhelm/ui/navigation/types";
import { assert, suite, test } from "./harness";

const items: readonly NavigationItem[] = [
  {
    label: "Learn",
    links: [{ href: "/guide", label: "Guide", description: "Start here", icon: BookOpen }],
    footer: { href: "/pro", label: "Explore Pro" },
  },
];

suite("reusable marketing navigation");

test("header accepts another product's brand, navigation, icons and menu footer", () => {
  const html = renderToStaticMarkup(
    createElement(MarketingHeader, {
      brand: createElement("a", { href: "/" }, "Example Product"),
      pathname: "/guide/",
      items,
    })
  );
  for (const value of [
    "Example Product",
    "Learn",
    "Guide",
    "Start here",
    "Explore Pro",
    'href="/pro"',
  ])
    assert.ok(html.includes(value), value);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /aria-expanded="false"/);
  assert.doesNotMatch(html, /SquareCampus|squarecampus|\/pricing|\/enterprise/);
});

test("mobile navigation shares links and optional footer without product-specific data", () => {
  const html = renderToStaticMarkup(
    createElement(MobileNavigation, { items, pathname: "/guide", onNavigate: () => {} })
  );
  assert.match(html, /href="\/guide"/);
  assert.match(html, /href="\/pro"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /SquareCampus|squarecampus/);
});
