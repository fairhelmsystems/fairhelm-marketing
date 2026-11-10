import { expect, test } from "@playwright/test";

const origin = "http://localhost:3100";
const walkthroughTitle = "One question. A complete analytical answer.";

async function openExample(page: import("@playwright/test").Page, name = "Attendance check") {
  await page.goto(`${origin}/pricing/#aic-examples`);
  await page.getByRole("button", { name, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: walkthroughTitle, exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}

test("default Starter exposes all service choices and current pricing navigation", async ({
  page,
}, info) => {
  await page.goto(`${origin}/pricing/`);
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Add optional services", { exact: true }).click();
  const cards = page.locator(".pricing-service-card");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) await expect(card).toBeVisible();
  await expect(page.getByRole("button", { name: "Starter", exact: true })).toHaveAttribute(
    "data-pressed",
    ""
  );
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  await page.screenshot({ path: info.outputPath("default-starter-full.png"), fullPage: true });
  const clip = await page.locator(".pricing-workbench").evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x: x + scrollX, y: y + scrollY, width, height };
  });
  await page.screenshot({ path: info.outputPath("default-starter-workbench.png"), clip });
  for (const card of await cards.all()) await expect(card).toBeVisible();
  const navigation = page.locator("header");
  if ((page.viewportSize()?.width ?? 0) < 1024) {
    await navigation.getByRole("button", { name: /Open.*menu|Open.*navigation/i }).click();
  }
  if ((page.viewportSize()?.width ?? 0) >= 1024)
    await page.getByRole("button", { name: "Pricing", exact: true }).click();
  await expect(page.getByRole("link", { name: /Pricing calculator/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Prepaid AIC/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /What uses AIC/ })).toBeVisible();
  await page.getByRole("link", { name: /Prepaid AIC/ }).click();
  await expect(page.getByRole("checkbox", { name: "Add prepaid AIC", exact: true })).toBeVisible();
});

test("prepaid checkbox opens a minimum-1000 purchase and clears it safely", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${origin}/pricing/#aic-packs`);
  const purchase = page.getByRole("checkbox", { name: "Add prepaid AIC", exact: true });
  await expect(purchase).not.toBeChecked();
  await expect(page.locator("#pricing-prepaid-aic")).toHaveCount(0);
  await purchase.check();
  const slider = page.getByRole("slider", { name: "Adjust extra prepaid aic", exact: true });
  await expect(slider).toHaveAttribute("min", "1000");
  await slider.press("Home");
  await slider.press("ArrowRight");
  await expect(page.locator("#pricing-prepaid-aic")).toHaveText("1,001");
  await slider.press("ArrowLeft");
  await slider.press("ArrowLeft");
  await expect(page.locator("#pricing-prepaid-aic")).toHaveText("1,000");
  await page.locator("#pricing-prepaid-aic").click();
  const input = page.getByRole("spinbutton", { name: "Extra prepaid AIC", exact: true });
  await input.fill("857");
  await expect(page.getByRole("button", { name: "Starter", exact: true })).toContainText(
    "₹2,05,000"
  );
  await input.press("Enter");
  await expect(page.locator("#pricing-prepaid-aic")).toHaveText("1,000");
  await expect(page.getByTestId("aic-purchase-price")).toContainText("₹5,000");
  await expect(page.getByRole("button", { name: "Copy estimate link", exact: true })).toBeEnabled();
  await purchase.uncheck();
  await expect(page.locator("#pricing-prepaid-aic")).toHaveCount(0);
  await expect(page.getByTestId("aic-purchase-price")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("manual plans, compact services and approved monthly grants stay coherent", async ({
  page,
}, info) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto(`${origin}/pricing/`);
  await expect(
    page.getByText("We have already purchased app branding", { exact: true })
  ).toHaveCount(0);
  await expect(page.getByText("We need a custom service quote", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel(/Expected peak external API requests/)).toHaveCount(0);
  await expect(
    page.getByRole("checkbox", { name: "Automatically recommend a plan", exact: true })
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Enterprise", exact: true }).click();
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Add optional services", { exact: true }).click();
  const cards = page.locator(".pricing-service-card");
  await cards.nth(0).click();
  await expect(page.locator("#pricing-api")).toBeChecked();
  await cards.nth(1).click();
  await expect(page.locator("#pricing-sso")).toBeChecked();
  const cardMetrics = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        height: rect.height,
        clipped: element.scrollWidth > element.clientWidth,
        overflow: [
          ...element.querySelectorAll(
            ".pricing-service-name, .pricing-option-price, [data-slot='field-description']"
          ),
        ].some((child) => child.getBoundingClientRect().right > rect.right - 6),
      };
    })
  );
  for (const card of cardMetrics) {
    expect(card.clipped).toBe(false);
    expect(card.overflow).toBe(false);
    expect(card.height).toBeLessThan(190);
  }
  await page
    .locator(".pricing-service-options")
    .screenshot({ path: info.outputPath("enterprise-services.png") });
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    const bounds = await cards.evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width } = element.getBoundingClientRect();
        return { x, y, width };
      })
    );
    expect(bounds[0].y).toBe(bounds[1].y);
    expect(bounds[2].y).toBeGreaterThan(bounds[0].y);
    expect(bounds[2].width).toBeGreaterThan(bounds[0].width);
  }
  await expect(
    page.locator("#pricing-aic, #pricing-aic-range, .pricing-aic-result, .pricing-aic-forecast")
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "The published student rates.", exact: true })
  ).toHaveCount(0);
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  for (const [name, credits] of [
    ["Starter", "3,600"],
    ["Growth", "7,200"],
    ["Enterprise", "10,800"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(
      page
        .locator("#live-estimate dt")
        .filter({ hasText: "Monthly communication credits" })
        .locator("..")
        .locator("dd")
    ).toHaveText(credits);
    if (name === "Growth")
      await page
        .locator(".pricing-service-options")
        .screenshot({ path: info.outputPath("growth-services.png") });
  }
  await page.getByRole("button", { name: "Growth", exact: true }).click();
  await expect(
    page
      .locator("#live-estimate dt")
      .filter({ hasText: /^Monthly included AIC$/ })
      .locator("..")
      .locator("dd")
  ).toHaveText("1,500 AIC");
  await page.getByRole("button", { name: "Enterprise", exact: true }).click();
  await expect(
    page
      .locator("#live-estimate dt")
      .filter({ hasText: /^Monthly included AIC$/ })
      .locator("..")
      .locator("dd")
  ).toHaveText("4,000 AIC");
  expect(consoleErrors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("all sample scenarios stop for approval and produce their computed answers", async ({
  page,
}, info) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/")) requests.push(request.url());
  });
  const dialog = await openExample(page);
  for (const [scenario, summary] of [
    ["Attendance check", "3 sample students"],
    ["Fee reconciliation", "₹4,80,000"],
    ["Policy-aware review", "Two sample cohorts"],
  ]) {
    await dialog.getByRole("button", { name: scenario, exact: true }).click();
    const next = dialog.getByRole("button", { name: "Next stage", exact: true });
    for (let index = 0; index < 3; index++) await next.click();
    await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "approval");
    await expect(dialog).toContainText("AIC quote shown before execution");
    await expect(next).toBeDisabled();
    await expect(dialog).toContainText("Institutional records remain unread.");
    await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
    for (let index = 0; index < 3; index++) await next.click();
    await expect(dialog.getByTestId("aic-sample-answer")).toContainText(summary);
    await expect(dialog.locator(".aic-operation-receipt")).toHaveCount(1);
    if (scenario === "Attendance check" || scenario === "Policy-aware review") {
      await dialog.getByTestId("aic-sample-answer").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: info.outputPath(
          `${scenario === "Attendance check" ? "simple" : "complex"}-answer.png`
        ),
        fullPage: false,
      });
    }
  }
  await dialog.getByRole("button", { name: "Close AEGIS walkthrough", exact: true }).click();
  await expect(page.getByRole("button", { name: "Attendance check", exact: true })).toBeFocused();
  expect(requests).toEqual([]);
});

test("access and unapproved scope block retrieval while failure supports one coherent retry", async ({
  page,
}) => {
  const dialog = await openExample(page);
  await dialog.getByText("Scope, sources and safeguards", { exact: true }).click();
  await dialog.getByLabel("Explore a boundary", { exact: true }).selectOption("access-denied");
  await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await expect(dialog).toContainText(
    "Access denied. Restricted records stay unread. No AIC charge."
  );
  await expect(dialog.getByRole("button", { name: "Next stage", exact: true })).toBeDisabled();
  await dialog.getByLabel("Explore a boundary", { exact: true }).selectOption("scope-unapproved");
  for (let index = 0; index < 3; index++)
    await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "Continue example", exact: true })
  ).toBeDisabled();
  await dialog.getByLabel("Explore a boundary", { exact: true }).selectOption("platform-failure");
  for (let index = 0; index < 3; index++)
    await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
  await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await expect(dialog).toContainText("The illustrated reservation is released. No AIC charge.");
  await dialog.getByRole("button", { name: "Retry example", exact: true }).click();
  for (let index = 0; index < 3; index++)
    await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await expect(dialog.locator(".aic-operation-receipt")).toHaveCount(1);
});

test("playback pauses for approval, pause, hidden tabs and rapid scenario switches", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  const dialog = await openExample(page);
  await dialog.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await page.clock.runFor(5000);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "approval");
  await page.clock.runFor(30000);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "approval");
  await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
  await dialog.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.runFor(30000);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "records");
  await dialog.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(dialog.getByRole("button", { name: "Play walkthrough", exact: true })).toBeVisible();
  await page.clock.runFor(30000);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "records");
  for (const name of ["Policy-aware review", "Attendance check", "Fee reconciliation"])
    await dialog.getByRole("button", { name, exact: true }).click();
  await page.clock.runFor(30000);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "understand");
  await expect(dialog.locator(".aic-request")).toContainText("Trust finance lead");
});

test("reduced motion and no-script preserve readable sample evidence", async ({
  page,
  browser,
}, info) => {
  const dialog = await openExample(page, "Policy-aware review");
  for (const choice of await dialog.locator(".aic-scenario-selector button").all()) {
    await expect(choice).toHaveAccessibleName(await choice.innerText());
  }
  await expect(dialog).toContainText("Reduced motion. Explore each stage with the controls.");
  await expect(dialog.getByRole("button", { name: "Play walkthrough", exact: true })).toHaveCount(
    0
  );
  await page.screenshot({ path: info.outputPath("reduced-motion.png"), fullPage: false });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize() ?? undefined,
  });
  const staticPage = await context.newPage();
  await staticPage.goto(`${origin}/pricing/`);
  await staticPage.getByText("AI and communication credits", { exact: true }).click();
  await staticPage.getByText("Read the three sample answers", { exact: true }).click();
  await expect(
    staticPage.getByText("Attendance check sample answer", { exact: true })
  ).toBeVisible();
  await expect(
    staticPage.getByText("Policy-aware review sample answer", { exact: true })
  ).toBeVisible();
  await expect(staticPage.locator(".aic-static-examples")).toContainText("₹4,80,000");
  await context.close();
});

test("Enterprise includes branding and presents conditional first-year and recurring value", async ({
  page,
}) => {
  await page.goto(`${origin}/pricing/`);
  await page.getByRole("button", { name: "Enterprise", exact: true }).click();
  if ((page.viewportSize()?.width ?? 0) < 640) {
    await page.getByText("Add optional services", { exact: true }).click();
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  }
  const branding = page.getByRole("checkbox", {
    name: "White-label Android and iOS apps Included",
    exact: true,
  });
  await branding.check();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,00,000");
  await branding.uncheck();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,00,000");
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Plan inclusions", { exact: true }).click();
  await expect(page.getByTestId("enterprise-first-year-value")).toHaveText("₹1,43,300");
  await expect(page.getByTestId("enterprise-recurring-value")).toHaveText("₹1,18,300");
  const contrast = await page.locator(".enterprise-value").evaluate((element) => ({
    surface: getComputedStyle(element).color,
    label: getComputedStyle(element.querySelector("dt")!).color,
  }));
  expect(contrast.label).toBe(contrast.surface);
  await page.getByRole("button", { name: "Every core feature, every plan", exact: true }).click();
  const promise = page.getByRole("dialog", { name: "Every core feature, every plan", exact: true });
  await expect(promise).toContainText("PTM when released");
  await expect(promise).toContainText("no extra feature fee");
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("plan summaries separate selection from included SSO and align their facts", async ({
  page,
}, info) => {
  await page.goto(`${origin}/pricing/`);
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Compare the three plans", { exact: true }).click();
  const bands = page.locator(".pricing-plan");
  await expect(bands).toHaveCount(3);
  await expect(bands.locator("details")).toHaveCount(0);
  await expect(bands.locator(".pricing-plan-selected")).toHaveCount(1);
  const enterprise = page.locator("#plan-enterprise");
  const badge = enterprise.locator('[data-slot="badge"]');
  await expect(badge).toHaveText("SSO included");
  await expect(enterprise).toHaveAttribute("data-selected", "false");
  await enterprise.getByRole("button", { name: "Choose Enterprise", exact: true }).click();
  await expect(enterprise).toHaveAttribute("data-selected", "true");
  await expect(enterprise.locator(".pricing-plan-selected")).toHaveText("Selected");
  await expect(badge).toHaveText("SSO included");
  await expect(bands.locator(".pricing-plan-facts dt")).toHaveCount(9);
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Plan inclusions", { exact: true }).click();
  const matrix = page.locator("#model");
  const dashboard = matrix.getByRole("row").filter({ hasText: "Custom AEGIS dashboards" });
  await expect(dashboard).toContainText("included in Enterprise");
  await expect(dashboard).not.toContainText("scoped and quoted");
  const noteSections = matrix.locator(".pricing-plan-notes > section");
  await expect(noteSections).toHaveCount(2);
  for (const section of await noteSections.all()) await expect(section).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    for (const selector of [
      ".pricing-plan-cost",
      ".pricing-plan-purpose",
      ".pricing-plan-facts",
      "button",
    ]) {
      const tops = await bands
        .locator(selector)
        .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
      expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
    }
    const notes = await noteSections.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top)
    );
    expect(Math.abs(notes[0] - notes[1])).toBeLessThan(2);
  }
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  await page.screenshot({ path: info.outputPath("plans-and-notes-expanded.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("Remotion playback follows stages and pauses at the quote boundary", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const dialog = await openExample(page);
  const movie = dialog.locator(".aic-motion-view video");
  await expect(movie).not.toHaveAttribute("src", /.+/);
  await dialog.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await expect(movie).toHaveAttribute("src", /aic-attendance-check-.*\.mp4/);
  await expect
    .poll(() => movie.evaluate((element: HTMLVideoElement) => element.readyState))
    .toBeGreaterThan(1);
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "approval", {
    timeout: 10000,
  });
  await expect.poll(() => movie.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(dialog.locator(".aic-operation-receipt")).toHaveCount(0);
  await expect(dialog).toContainText("Institutional records remain unread.");
  await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
  await dialog.getByRole("button", { name: "Pause", exact: true }).click();
  await expect.poll(() => movie.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await dialog.getByRole("button", { name: "Next stage", exact: true }).click();
  await expect(dialog.getByTestId("aic-motion")).toHaveAttribute("data-stage", "analyse");
  await dialog.getByText("Inspect the records and calculation", { exact: true }).click();
  await expect(dialog).toContainText("Student D");
  await page.screenshot({
    path: info.outputPath("remotion-attendance-analysis.png"),
    fullPage: false,
  });
  await dialog.getByRole("button", { name: "Fee reconciliation", exact: true }).click();
  await expect(dialog.getByTestId("aic-motion")).toHaveAttribute("data-stage", "understand");
  await expect(dialog.locator(".aic-motion-view video")).not.toHaveAttribute("src", /.+/);
});

test("data-saving mode keeps AIC motion as stage stills", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: Object.assign(new EventTarget(), { saveData: true }),
    });
  });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) requests.push(request.url());
  });
  const dialog = await openExample(page);
  await dialog.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await expect(dialog.locator(".aic-stage-scene")).toHaveAttribute("data-stage", "access");
  await expect(dialog.locator(".aic-motion-view video")).not.toHaveAttribute("src", /.+/);
  expect(requests).toEqual([]);
});

for (const theme of ["light", "dark"] as const) {
  test(`AIC stories show readable authored scenes in ${theme} mode`, async ({ page }, info) => {
    await page.addInitScript(
      (value) => localStorage.setItem("fairhelm-marketing-theme", value),
      theme
    );
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    const dialog = await openExample(page);
    for (const [name, id] of [
      ["Attendance check", "attendance-check"],
      ["Fee reconciliation", "fee-reconciliation"],
      ["Policy-aware review", "policy-aware-review"],
    ]) {
      await dialog.getByRole("button", { name, exact: true }).click();
      const next = dialog.getByRole("button", { name: "Next stage", exact: true });
      for (let index = 0; index < 3; index++) await next.click();
      await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
      await next.click();
      const poster = dialog.locator(".aic-motion-poster img:visible");
      await expect(poster).toHaveAttribute("src", new RegExp(`aic-${id}-${theme}-stage-analyse`));
      await expect(poster).toHaveJSProperty("naturalWidth", 960);
      await expect(dialog.locator(".aic-motion-view video")).not.toHaveAttribute("src", /.+/);
      await dialog.locator(".aic-stage-scene").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: info.outputPath(`${id}-${theme}-analysis.png`),
        fullPage: false,
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false
      );
    }
    await dialog.getByRole("button", { name: "Close AEGIS walkthrough", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    const gallery = page.locator(".aic-example-triggers");
    await expect(gallery).toBeVisible();
    await gallery.screenshot({ path: info.outputPath(`aic-gallery-${theme}.png`) });
  });
}

test("an unavailable movie keeps stage evidence and one complete sample answer", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/motion/*.mp4", (route) => route.abort("failed"));
  const dialog = await openExample(page);
  await dialog.getByRole("button", { name: "Play walkthrough", exact: true }).click();
  await expect(dialog.locator(".aic-motion-fallback")).toBeVisible();
  await dialog.getByRole("button", { name: "Pause", exact: true }).click();
  await dialog.getByRole("button", { name: "Replay", exact: true }).click();
  const next = dialog.getByRole("button", { name: "Next stage", exact: true });
  for (let index = 0; index < 3; index++) await next.click();
  await expect(next).toBeDisabled();
  await expect(dialog).toContainText("Institutional records remain unread.");
  await dialog.getByRole("button", { name: "Continue example", exact: true }).click();
  await dialog.getByRole("button", { name: "Pause", exact: true }).click();
  for (let index = 0; index < 3; index++) await next.click();
  await expect(dialog.getByTestId("aic-sample-answer")).toContainText("3 sample students");
  await expect(dialog.locator(".aic-operation-receipt")).toHaveCount(1);
});
