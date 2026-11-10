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
