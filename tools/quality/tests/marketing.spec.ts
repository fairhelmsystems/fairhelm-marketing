import { expect, type Page, test } from "@playwright/test";
import { sites } from "../matrix";

async function ready(page: Page, url: string) {
  const response = await page.goto(url);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The hydrated label is also a readiness signal for the shared client shell.
  await expect(page.getByRole("button", { name: /^Switch to (light|dark) theme$/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function checkWidth(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));
  expect(widths.content, JSON.stringify(widths)).toBeLessThanOrEqual(widths.viewport + 1);
}

async function checkDrawer(page: Page, trigger: ReturnType<Page["getByRole"]>) {
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toBeVisible();
  // A drawer contains focus throughout both directions of keyboard traversal.
  for (const key of ["Tab", "Tab", "Shift+Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    await expect
      .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  // Closing must release scroll locking; otherwise the visitor is stranded.
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
    .not.toBe("hidden");
}

for (const site of sites) {
  test.describe(site.name, () => {
    for (const route of site.routes) {
      test(`${route} layout, canonical and light/dark review captures`, async ({ page }, info) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await ready(page, `${site.origin}${route}`);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          "href",
          `${site.canonical}${route}`
        );
        for (const theme of ["dark", "light"] as const) {
          if ((await page.locator("html").getAttribute("data-theme")) !== theme)
            await page.getByRole("button", { name: `Switch to ${theme} theme` }).click();
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await checkWidth(page);
          await info.attach(`${theme}-full-page`, {
            body: await page.screenshot({ fullPage: true, animations: "disabled" }),
            contentType: "image/png",
          });
        }
        // Captures require human review; creating a PNG is not a parity assertion.
        expect(errors).toEqual([]);
      });
    }

    test("keyboard skip link and persistent theme", async ({ page }) => {
      await ready(page, `${site.origin}/`);
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("main")).toBeFocused();
      await page.getByRole("button", { name: "Switch to light theme" }).click();
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
    });

    test("responsive navigation opens and follows a route", async ({ page }) => {
      await ready(page, `${site.origin}/`);
      if ((page.viewportSize()?.width ?? 0) < 1024) {
        const toggle = page.getByRole("button", { name: "Open navigation" });
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        const nav = page.getByRole("navigation", { name: "Primary (mobile)", exact: true });
        await expect(nav).toBeVisible();
        await checkWidth(page);
        // Close and reopen, then follow a local route distinct from the homepage.
        await page.getByRole("button", { name: "Close navigation" }).click();
        await expect(nav).toBeHidden();
        await page.getByRole("button", { name: "Open navigation" }).click();
        const link = nav.locator('a[href^="/"]:not([href="/"])').first();
        const destination = await link.getAttribute("href");
        expect(destination).toBeTruthy();
        await link.click();
        await expect(page).toHaveURL(new URL(destination ?? "/", site.origin).href);
        await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
      } else {
        await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
        const nav = page.getByRole("navigation", { name: "Primary", exact: true });
        await expect(nav).toBeVisible();
        const disclosure = nav.locator("button[aria-expanded]").first();
        if (await disclosure.count()) {
          await disclosure.focus();
          await page.keyboard.press("Enter");
          await expect(disclosure).toHaveAttribute("aria-expanded", "true");
          await page.keyboard.press("Tab");
          await page.keyboard.press("Escape");
          await expect(disclosure).toHaveAttribute("aria-expanded", "false");
          await expect(disclosure).toBeFocused();
        }
      }
    });

    if (site.drawerRoute !== null) {
      test("phone section drawer traps and restores focus", async ({ page }) => {
        test.skip((page.viewportSize()?.width ?? 0) >= 640, "Sections are inline from sm upwards.");
        await ready(page, `${site.origin}${site.drawerRoute}`);
        await checkDrawer(
          page,
          page.getByRole("button").and(page.locator('[aria-haspopup="dialog"]')).first()
        );
      });
    }
  });
}
