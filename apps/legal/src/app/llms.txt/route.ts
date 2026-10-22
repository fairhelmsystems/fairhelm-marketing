import {
  fairhelmLegalPaths,
  LEGAL_ORIGIN,
  legalUrl,
  squarecampusLegalPaths,
} from "@fairhelm/config/urls";
export const dynamic = "force-static";
export function GET() {
  const lines = [
    "# Fairhelm Legal",
    "",
    "> Company and product policies published by Fairhelm Systems (OPC) Private Limited.",
    "",
    "Documents retain their stated scope. Signed agreements and order forms govern the engagements they cover.",
  ];
  for (const [scope, paths] of [
    ["fairhelm", fairhelmLegalPaths],
    ["squarecampus", squarecampusLegalPaths],
  ] as const) {
    lines.push("", `## ${scope === "fairhelm" ? "Company and services" : "SquareCampus"}`);
    for (const slug of paths.filter((slug) => slug !== "competitor-notice" && slug !== "legal"))
      lines.push(
        `- [${slug.replaceAll("-", " ")}](${legalUrl(scope, slug)}): The current ${scope} document.`
      );
  }
  lines.push("", `Index: ${LEGAL_ORIGIN}/`);
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
