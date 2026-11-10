/** Reveal native disclosures before the router scrolls to an in-page destination. */
export function revealAnchor(href: string) {
  let target: HTMLElement | null;
  try {
    const url = new URL(href, window.location.href);
    if (
      url.origin !== window.location.origin ||
      url.pathname.replace(/\/+$/, "") !== window.location.pathname.replace(/\/+$/, "")
    )
      return;
    target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  } catch {
    return;
  }
  if (!target) return;
  let ancestor = target.closest("details");
  while (ancestor) {
    ancestor.open = true;
    ancestor = ancestor.parentElement?.closest("details") ?? null;
  }
  // SectionShell gives its section the anchor and its disclosure the content.
  for (const disclosure of target.querySelectorAll<HTMLDetailsElement>(
    "details.responsive-disclosure"
  )) {
    if (disclosure.closest("[id]") === target) disclosure.open = true;
  }
}
