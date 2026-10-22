import { renderLlmsTxt } from "./llms";

export type FullContextDocument = { url: string; markdown: string };

/** Full context is derived from the public HTML, never a second copy of its claims. */
export function renderLlmsFullTxt(documents: readonly FullContextDocument[]): string {
  return [
    "# SquareCampus — Full public website context",
    "",
    "Public, indexable marketing pages rendered as Markdown. Each document carries its canonical URL. Navigation, forms, scripts and decorative media are omitted by the site's existing Markdown converter.",
    "",
    renderLlmsTxt().trimEnd(),
    ...documents.flatMap(({ url, markdown }) => [
      "",
      "---",
      "",
      `Source: ${url}`,
      "",
      markdown.trimEnd(),
    ]),
    "",
  ].join("\n");
}
