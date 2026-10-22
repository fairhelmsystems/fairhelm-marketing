import { expect, test } from "bun:test";
import { companyFooterGroups, type CompanyPublication } from "../src/footer";

const apps: CompanyPublication[] = ["fairhelm", "legal", "press", "blogs"];
const origins = {
  fairhelm: "https://fairhelmsystems.com",
  legal: "https://legal.fairhelmsystems.com",
  press: "https://press.fairhelmsystems.com",
  blogs: "https://blogs.squarecampus.com",
};
for (const app of apps) {
  test(`${app} footer resolves each link to the owning app`, () => {
    const links = companyFooterGroups(app).flatMap((group) => group.links);
    const href = (label: string) => {
      const link = links.find((link) => link.label === label);
      expect(link).toBeDefined();
      return new URL(link!.href, origins[app]).href;
    };
    expect(href("Fairhelm Systems")).toBe(`${origins.fairhelm}/`);
    expect(href("SquareCampus")).toBe(`${origins.fairhelm}/squarecampus/`);
    expect(href("squarecampus.com")).toBe("https://squarecampus.com/");
    expect(href("Legal center")).toBe(`${origins.legal}/`);
    expect(href("Privacy")).toBe(`${origins.legal}/fairhelm/privacy/`);
    expect(href("Press")).toBe(`${origins.press}/`);
    expect(href("Journal")).toBe(`${origins.blogs}/`);
    expect(href("Contact")).toBe(`${origins.fairhelm}/contact/`);
    for (const link of links.filter((link) => link.href.startsWith("/"))) {
      expect(new URL(link.href, origins[app]).origin).toBe(origins[app]);
      // Apart from the home link, only routes owned by this app can be relative.
      if (app === "legal")
        expect(link.href === "/" || link.href.startsWith("/fairhelm/")).toBe(true);
      if (app === "blogs" || app === "press") expect(link.href).toBe("/");
    }
  });
}
