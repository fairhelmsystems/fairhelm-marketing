import { expect, test } from "@playwright/test";

test("closed phone pricing fits the reference reading length with usable disclosures", async ({
  page,
}) => {
  test.skip(page.viewportSize()?.width !== 390, "Reference phone layout is 390 × 844.");
  await page.goto("http://localhost:3100/pricing/");
  await expect(page.getByRole("button", { name: "Starter", exact: true })).toBeVisible();
  const layout = await page.evaluate(() => ({
    screens: document.documentElement.scrollHeight / innerHeight,
    overflow: document.documentElement.scrollWidth > innerWidth,
    targetHeights: [...document.querySelectorAll(".pricing-page .responsive-disclosure > summary")]
      .map((element) => element.getBoundingClientRect().height)
      .filter((height) => height > 0),
  }));
  expect(layout.screens).toBeLessThanOrEqual(2.5);
  expect(layout.overflow).toBe(false);
  expect(layout.targetHeights.length).toBeGreaterThan(0);
  for (const height of layout.targetHeights) expect(height).toBeGreaterThanOrEqual(44);
});

test("custom prepaid AIC accepts exact quantities and applies graduated rates", async ({
  page,
}) => {
  await page.goto("http://localhost:3100/pricing/#aic-packs");
  await expect(page.locator(".pricing-aic-pack")).toHaveCount(0);
  if (
    !(await page
      .locator("#pricing-usage-inputs")
      .evaluate((element) => (element as HTMLDetailsElement).open))
  )
    await page.getByText("Add usage and prepaid AIC", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Add prepaid AIC", exact: true }).check();
  await page.getByRole("button", { name: /^Edit extra prepaid aic,/i }).click();
  const input = page.getByRole("spinbutton", { name: "Extra prepaid AIC", exact: true });
  await input.fill("5001");
  await input.press("Enter");
  await expect(page.getByTestId("aic-purchase-price")).toContainText("₹25,004");
  const breakdown = page.getByText("Full estimate breakdown", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 640) await breakdown.click();
  await expect(page.getByTestId("selected-aic-purchase")).toContainText("5,001 prepaid AIC");
  await expect(page.getByTestId("first-year-total")).toHaveText("₹2,30,004");
  await expect(page.getByTestId("renewal-total")).toHaveText("₹2,05,000");
});

test("an extreme prepaid quantity produces a field error without crashing the calculator", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://localhost:3100/pricing/#aic-packs");
  if (
    !(await page
      .locator("#pricing-usage-inputs")
      .evaluate((element) => (element as HTMLDetailsElement).open))
  )
    await page.getByText("Add usage and prepaid AIC", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Add prepaid AIC", exact: true }).check();
  await page.getByRole("button", { name: /^Edit extra prepaid aic,/i }).click();
  const input = page.getByRole("spinbutton", { name: "Extra prepaid AIC", exact: true });
  await input.fill("9007199254740");
  await expect(page.locator("#pricing-prepaid-aic-error")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
  await input.fill("10000");
  await expect(page.getByRole("button", { name: "Copy estimate link", exact: true })).toBeEnabled();
  expect(errors).toEqual([]);
});

test("feature access opens as a popover without shifting the calculator", async ({ page }) => {
  await page.goto("http://localhost:3100/pricing/");
  const trigger = page.getByRole("button", {
    name: "Every core feature, every plan",
    exact: true,
  });
  const before = await page
    .locator("#pricing-studio")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await trigger.click();
  const popover = page.getByRole("dialog", {
    name: "Every core feature, every plan",
    exact: true,
  });
  await expect(popover).toBeVisible();
  await expect(popover).toContainText("Every generally available core SquareCampus module");
  expect(
    await page.locator("#pricing-studio").evaluate((el) => el.getBoundingClientRect().top + scrollY)
  ).toBe(before);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
  await page.keyboard.press("Escape");
  await expect(popover).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await expect(popover).toBeVisible();
  await popover.getByRole("button", { name: "Close", exact: true }).click();
  await expect(popover).not.toBeVisible();
});

test("feature access explanation is exported and works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/pricing/");
  await page.getByRole("button", { name: "Every core feature, every plan", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Every core feature, every plan", exact: true })
  ).toBeVisible();
  await context.close();
});

test("the prepaid purchase counts once and stays printable without a burn forecast", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=enterprise&auto=0&students=1200&sso=1&whiteLabel=1&prepaidAicCredits=10000&monthlyAic=400"
  );
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,70,000");
  await expect(page.getByTestId("renewal-total")).toHaveText("₹4,00,000");
  await expect(page.locator(".pricing-aic-forecast, #pricing-aic")).toHaveCount(0);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByTestId("selected-aic-purchase")).toBeVisible();
  await expect(page.getByTestId("selected-aic-purchase")).toContainText("10,000 prepaid AIC");
  await page.emulateMedia({ media: "screen" });
});

test("legacy monthly burn fields do not add hypothetical purchases or restrict prepaid quantity", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=starter&auto=1&students=1000&prepaidAicCredits=250000&monthlyAic=999999999"
  );
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹6,65,000");
  await expect(page.getByTestId("renewal-total")).toHaveText("₹1,75,000");
  await expect(page.getByTestId("selected-aic-purchase")).toContainText("2,50,000 prepaid AIC");
  await expect(page.locator(".pricing-aic-forecast, #pricing-aic, #pricing-aic-range")).toHaveCount(
    0
  );
  await expect(page.getByTestId("expected-year-spend")).toHaveCount(0);
});

for (const theme of ["dark", "light"]) {
  test(`manual plan selection stays highlighted in ${theme} mode`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("fairhelm-marketing-theme", value),
      theme
    );
    await page.goto("http://localhost:3100/pricing/");
    if ((page.viewportSize()?.width ?? 0) < 640)
      await page.getByText("Full estimate breakdown", { exact: true }).click();
    for (const name of ["Growth", "Enterprise", "Starter"]) {
      const selected = page.getByRole("button", { name, exact: true });
      await selected.click();
      await page.getByRole("heading", { level: 1 }).click();
      await expect(selected).toHaveAttribute("aria-pressed", "true");
      await expect(selected).toHaveAttribute("data-pressed", "");
      await expect(selected.locator("svg")).toBeVisible();
      const planHeading = page.getByTestId("selected-plan");
      await expect(planHeading).toHaveText(name);
      await expect(planHeading.locator("svg")).toBeVisible();
      expect(
        await planHeading.evaluate((element) => Number(getComputedStyle(element).fontWeight))
      ).toBeGreaterThanOrEqual(700);
      expect(
        await page
          .locator("#live-estimate")
          .evaluate((element) => getComputedStyle(element).backgroundImage)
      ).toContain("linear-gradient");
      await expect(
        page.getByRole("checkbox", { name: "Automatically recommend a plan", exact: true })
      ).toHaveCount(0);
      const otherName = name === "Starter" ? "Growth" : "Starter";
      const other = page.getByRole("button", { name: otherName, exact: true });
      await expect(other).toHaveAttribute("aria-pressed", "false");
      const selectedFill = await selected.evaluate(
        (element) => getComputedStyle(element).backgroundColor
      );
      const otherFill = await other.evaluate(
        (element) => getComputedStyle(element).backgroundColor
      );
      expect(selectedFill).not.toBe(otherFill);
      expect(await selected.evaluate((element) => getComputedStyle(element).color)).not.toBe(
        await other.evaluate((element) => getComputedStyle(element).color)
      );
    }
    await page.getByRole("button", { name: "Starter", exact: true }).click();
    await expect(page.getByRole("button", { name: "Starter", exact: true })).toHaveAttribute(
      "data-pressed",
      ""
    );
    if ((page.viewportSize()?.width ?? 0) >= 640) {
      const copy = page.getByRole("button", { name: "Copy estimate link", exact: true });
      const initialBorder = await copy.evaluate((element) => getComputedStyle(element).borderColor);
      await copy.hover();
      await expect
        .poll(() => copy.evaluate((element) => getComputedStyle(element).borderColor))
        .not.toBe(initialBorder);
    }
  });
}

test("malformed shared estimates recover valid selections and still produce a printable document", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=enterprise&auto=0&students=2400&sso=1&monthlyAic=400&smsSegments=oops&pack_aic_1000=2&pack_aic_10000=bad"
  );
  await expect(page.getByText(/Saved selections were adapted/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit enrolled students, 2,400" })).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  await expect(page.getByTestId("selected-plan")).toHaveText("Enterprise");
  await expect(page.getByTestId("selected-aic-purchase")).toContainText("2,000 prepaid AIC");
  const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true });
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  await testInfo.attach("recovered-pricing-estimate", {
    body: pdf,
    contentType: "application/pdf",
  });
  expect(errors).toEqual([]);
});

test("estimate assumptions open in a dismissible sheet and remain available in print", async ({
  page,
}) => {
  await page.goto("http://localhost:3100/pricing/");
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  const trigger = page.getByRole("button", { name: "Estimate assumptions", exact: true });
  await expect(trigger).toHaveCSS("text-decoration-line", "underline");
  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "Estimate assumptions", exact: true });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator("li")).toHaveCount(4);
  await expect(sheet).toContainText("₹25,000 once");
  await expect(sheet).toContainText("Purchased AIC carries forward");
  await page.keyboard.press("Escape");
  await expect(sheet).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".pricing-assumptions-print")).toBeVisible();
  await expect(page.locator(".pricing-assumptions-print li")).toHaveCount(4);
  await expect(trigger).not.toBeVisible();
});

test("API fees follow manual plan selection in purchase and renewal totals", async ({ page }) => {
  await page.goto("http://localhost:3100/pricing/");
  await page.getByRole("button", { name: "Enterprise", exact: true }).click();
  const options = page.getByText("Add optional services", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 640) await options.click();
  await page
    .getByRole("checkbox", {
      name: "Data & Events API ₹10,000/year",
      exact: true,
    })
    .check();
  await page
    .getByRole("checkbox", {
      name: "Microsoft Entra SSO Included",
      exact: true,
    })
    .check();
  await page
    .getByRole("checkbox", { name: "White-label Android and iOS apps ₹25,000 once", exact: true })
    .check();
  await expect(page.getByRole("button", { name: "Enterprise", exact: true })).toHaveAttribute(
    "data-pressed",
    ""
  );
  const breakdown = page.getByText("Full estimate breakdown", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 640) await breakdown.click();
  for (const [plan, fee, purchaseYear, renewal, capacity] of [
    ["Growth", "₹5,000", "₹2,95,500", "₹2,70,500", "500"],
    ["Enterprise", "₹10,000", "₹4,35,000", "₹4,10,000", "2,000"],
  ]) {
    await page.getByRole("button", { name: plan, exact: true }).click();
    await expect(page.getByTestId("first-year-total")).toHaveText(purchaseYear);
    await expect(page.getByTestId("renewal-total")).toHaveText(renewal);
    await expect(page.getByTestId("api-annual-price")).toHaveText(fee);
    await expect(page.locator("#pricing-api-help")).toContainText(
      `${capacity} requests per rolling 60-second window`
    );
    await expect(
      page.getByRole("checkbox", { name: `Data & Events API ${fee}/year`, exact: true })
    ).toBeChecked();
  }
  await expect(page.getByTestId("api-price-incomplete")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Discuss this estimate", exact: true })
  ).toHaveAttribute("href", /dataEventsApi=1/);
  if ((page.viewportSize()?.width ?? 0) < 640) await breakdown.click();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByTestId("api-annual-price")).toBeVisible();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,35,000");
  await expect(page.getByTestId("renewal-total")).toHaveText("₹4,10,000");
  await page.emulateMedia({ media: "screen" });
});

test("paid Starter SSO stays eligible while white-label apps require Growth", async ({ page }) => {
  await page.goto("http://localhost:3100/pricing/");
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Add optional services", { exact: true }).click();
  const sso = page.getByRole("checkbox", { name: "Microsoft Entra SSO ₹2,500/year", exact: true });
  const branding = page.getByRole("checkbox", {
    name: "White-label Android and iOS apps ₹25,000 once",
    exact: true,
  });
  const growth = page.getByRole("button", { name: "Growth", exact: true });
  const starter = page.getByRole("button", { name: "Starter", exact: true });
  await sso.check();
  await expect(starter).toHaveAttribute("data-pressed", "");
  await sso.uncheck();
  await expect(starter).toHaveAttribute("data-pressed", "");
  await branding.check();
  await expect(starter).toHaveAttribute("data-pressed", "");
  await growth.click();
  await expect(growth).toHaveAttribute("data-pressed", "");
  await sso.check();
  await starter.click();
  await expect(starter).toHaveAttribute("data-pressed", "");
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Print / save PDF", exact: true })).toBeDisabled();
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  await expect(page.getByTestId("quote-invalid")).toContainText("require Growth or Enterprise");
  await expect(page.getByRole("link", { name: "Discuss this estimate", exact: true })).toHaveCount(
    0
  );
  await growth.click();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹2,90,500");
  await expect(page.getByTestId("renewal-total")).toHaveText("₹2,65,500");
  await expect(page.getByRole("button", { name: "Copy estimate link", exact: true })).toBeEnabled();
  await expect(page.getByTestId("quote-invalid")).toHaveCount(0);
});

test("Enterprise SSO is optional at the same price with either activation choice", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=enterprise&auto=0&students=1200"
  );
  if ((page.viewportSize()?.width ?? 0) < 640) {
    await page.getByText("Add optional services", { exact: true }).click();
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  }
  const sso = page.getByRole("checkbox", {
    name: "Microsoft Entra SSO Included",
    exact: true,
  });
  await expect(sso).not.toBeChecked();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,00,000");
  await sso.check();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,00,000");
  await sso.uncheck();
  await expect(page.getByTestId("first-year-total")).toHaveText("₹4,00,000");
  await expect(page.getByRole("button", { name: "Enterprise", exact: true })).toHaveAttribute(
    "data-pressed",
    ""
  );
});

test("restored incompatible Starter estimates display the eligibility correction", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=starter&auto=0&students=1200&sso=1&whiteLabel=1"
  );
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Full estimate breakdown", { exact: true }).click();
  await expect(page.getByTestId("quote-invalid")).toContainText("Growth or Enterprise");
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
  await page.getByRole("button", { name: "Growth", exact: true }).click();
  await expect(page.getByRole("button", { name: "Growth", exact: true })).toHaveAttribute(
    "data-pressed",
    ""
  );
  await expect(page.getByTestId("first-year-total")).toHaveText("₹2,90,500");
});

test("student input sits beside the slider and keeps exact typed and keyboard values", async ({
  page,
}) => {
  await page.goto("http://localhost:3100/pricing/");
  const count = page.getByRole("button", { name: /^Edit enrolled students,/ });
  const input = page.getByRole("spinbutton", { name: "Enrolled students", exact: true });
  const slider = page.getByRole("slider", { name: "Adjust enrolled students", exact: true });
  await expect(count).toHaveText("1,200");
  await expect(input).toHaveCount(0);
  await count.click();
  await expect(input).toBeFocused();
  const inputBox = await input.boundingBox();
  const sliderBox = await slider.boundingBox();
  expect(inputBox).not.toBeNull();
  expect(sliderBox).not.toBeNull();
  expect(inputBox!.x).toBeGreaterThan(sliderBox!.x + sliderBox!.width);
  expect(Math.abs(inputBox!.y - sliderBox!.y)).toBeLessThan(2);
  expect(
    await page
      .locator("#pricing-enrolment-range-ticks option")
      .evaluateAll((options) => options.map((option) => option.getAttribute("value")))
  ).toEqual(["100", "2500", "5000", "10000"]);
  await input.fill("10001");
  await expect(input).toHaveValue("10001");
  await expect(slider).toHaveValue("10001");
  await expect(slider).toHaveAttribute("max", "20000");
  await input.press("Enter");
  await expect(count).toHaveText("10,001");
  await expect(count).toBeFocused();
  await expect(input).toHaveCount(0);
  await count.click();
  await input.fill("105000");
  await page.getByRole("heading", { level: 1 }).click();
  await expect(count).toHaveText("1,05,000");
  await expect(input).toHaveCount(0);
  await expect(slider).toHaveValue("105000");
  await expect(slider).toHaveAttribute("max", "200000");
  await slider.press("Home");
  await expect(count).toHaveText("100");
  await expect(slider).toHaveAttribute("max", "200000");
  await slider.press("ArrowRight");
  await expect(count).toHaveText("101");
  await count.click();
  await input.fill("99");
  await input.press("Enter");
  await expect(page.locator("#pricing-students-error")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=starter&auto=0&students=105000"
  );
  await expect(count).toHaveText("1,05,000");
  await expect(slider).toHaveValue("105000");
  await expect(slider).toHaveAttribute("max", "200000");
  for (const students of ["6842", "5000000"]) {
    await count.click();
    await input.fill(students);
    await input.press("Enter");
    const spacing = await count.evaluate((element) => {
      const text = document.createRange();
      text.selectNodeContents(element);
      const value = element.getBoundingClientRect();
      const sliderElement = document.getElementById("pricing-enrolment-range");
      if (!sliderElement) throw new Error("The enrolment slider must be present.");
      const track = sliderElement.getBoundingClientRect();
      return {
        gap: text.getBoundingClientRect().left - track.right,
        unusedWidth: value.width - text.getBoundingClientRect().width,
        clipped: element.scrollWidth > element.clientWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(spacing.gap).toBeCloseTo(8, 1);
    expect(spacing.unusedWidth).toBeLessThan(1);
    expect(spacing.clipped).toBe(false);
    expect(spacing.overflow).toBe(false);
  }
});

test("the student cap allows 50 lakh and rejects larger edits", async ({ page }) => {
  await page.goto("http://localhost:3100/pricing/");
  const count = page.getByRole("button", { name: /^Edit enrolled students,/ });
  const input = page.getByRole("spinbutton", { name: "Enrolled students", exact: true });
  const slider = page.getByRole("slider", { name: "Adjust enrolled students", exact: true });
  await count.click();
  await input.fill("5000000");
  await input.press("Enter");
  await expect(count).toHaveText("50,00,000");
  await expect(slider).toHaveAttribute("max", "5000000");
  await expect(slider).toHaveValue("5000000");
  await expect(page.getByRole("button", { name: "Copy estimate link", exact: true })).toBeEnabled();
  await count.click();
  await input.fill("5000001");
  await input.press("Enter");
  await expect(page.locator("#pricing-students-error")).toContainText("50,00,000");
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
});

test("legacy API peaks recover to the current manual plan and published service limits", async ({
  page,
}) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=pro&auto=1&students=1200&dataEventsApi=1&apiPeakRequests=501&apiPeakWindowSeconds=60"
  );
  await expect(page.getByRole("button", { name: "Growth", exact: true })).toHaveAttribute(
    "data-pressed",
    ""
  );
  await expect(page.locator("#pricing-api-peak")).toHaveCount(0);
  await expect(
    page.getByText(
      "Saved selections were adapted to the current controls. Review all quantities before sharing.",
      { exact: true }
    )
  ).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) < 640)
    await page.getByText("Add optional services", { exact: true }).click();
  await expect(page.locator("#pricing-api-help")).toContainText(
    "500 requests per rolling 60-second window"
  );
  await page.getByRole("button", { name: "Enterprise", exact: true }).click();
  await expect(page.locator("#pricing-api-help")).toContainText(
    "2,000 requests per rolling 60-second window"
  );
});

test("all usage quantities have sliders with exact editable values and optional blanks", async ({
  page,
}) => {
  await page.goto("http://localhost:3100/pricing/");
  const options = page.getByText("Add optional services", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 640) await options.click();
  await page.getByRole("checkbox", { name: "Data & Events API ₹2,500/year", exact: true }).check();
  await page.getByText("Add usage and prepaid AIC", { exact: true }).click();
  for (const id of ["pricing-sms", "pricing-emails", "pricing-whatsapp"]) {
    const label = page.locator(`#${id}`);
    const slider = page.locator(`#${id}-range`);
    await expect(label).toHaveText("Not set");
    await expect(slider).toHaveValue("0");
    await expect(slider).toHaveAttribute("aria-valuetext", "Not set");
    await slider.press("ArrowRight");
    await expect(label).toHaveText("1");
    await label.click();
    await expect(label).toBeFocused();
    await label.fill("7500");
    await label.press("Enter");
    await expect(label).toHaveText("7,500");
    await expect(label).toBeFocused();
    await expect(slider).toHaveValue("7500");
  }

  const sms = page.locator("#pricing-sms");
  await sms.click();
  await sms.fill("12.5");
  await sms.press("Enter");
  await expect(page.locator("#pricing-sms-error")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy estimate link", exact: true })
  ).toBeDisabled();
  await sms.click();
  await sms.fill("105000");
  await page.locator("#pricing-emails-range").click();
  await expect(sms).toHaveText("1,05,000");
  await expect(page.locator("#pricing-sms-range")).toHaveAttribute("max", "200000");
  await page.locator("#pricing-sms-range").press("Home");
  await expect(sms).toHaveText("0");
  await expect(page.locator("#pricing-sms-range")).toHaveAttribute("max", "200000");
});

test("usage sliders restore exact shared quantities and expand their domains", async ({ page }) => {
  await page.goto(
    "http://localhost:3100/pricing/?pricing=1&v=2026-11-10.1&plan=starter&auto=0&students=1200&dataEventsApi=1&apiPeakRequests=7500&apiPeakWindowSeconds=60&monthlyAic=123.456&smsSegments=105000&recipientEmails=1000000000&whatsappMessages=2"
  );
  await page.getByText("Add usage and prepaid AIC", { exact: true }).click();
  for (const [id, value, displayed, maximum] of [
    ["pricing-sms", "105000", "1,05,000", "200000"],
    ["pricing-emails", "1000000000", "1,00,00,00,000", "1000000000"],
    ["pricing-whatsapp", "2", "2", "10000"],
  ]) {
    await expect(page.locator(`#${id}`)).toHaveText(displayed);
    await expect(page.locator(`#${id}-range`)).toHaveValue(value);
    await expect(page.locator(`#${id}-range`)).toHaveAttribute("max", maximum);
  }
  await expect(page.getByRole("button", { name: "Copy estimate link", exact: true })).toBeEnabled();
});

test("slab cards follow active student bands and keep their exact subtotals", async ({ page }) => {
  await page.goto("http://localhost:3100/pricing/");
  const breakdown = page.getByText("Full estimate breakdown", { exact: true });
  if ((page.viewportSize()?.width ?? 0) < 640) await breakdown.click();
  const cards = page.getByTestId("pricing-slab-card");
  for (const [students, count, amounts, total] of [
    ["100", 0, [], "₹17,500"],
    ["1000", 0, [], "₹1,75,000"],
    ["1001", 2, ["₹1,75,000", "₹150"], "₹1,75,150"],
    ["1200", 2, ["₹1,75,000", "₹30,000"], "₹2,05,000"],
    ["5000", 2, ["₹1,75,000", "₹6,00,000"], "₹7,75,000"],
    ["5001", 3, ["₹1,75,000", "₹6,00,000", "₹110"], "₹7,75,110"],
    ["6000", 3, ["₹1,75,000", "₹6,00,000", "₹1,10,000"], "₹8,85,000"],
  ] as const) {
    await page.getByRole("button", { name: /^Edit enrolled students,/ }).click();
    await page.getByRole("spinbutton", { name: "Enrolled students", exact: true }).fill(students);
    await page.getByRole("spinbutton", { name: "Enrolled students", exact: true }).press("Enter");
    await expect(cards).toHaveCount(count);
    await expect(
      page.getByRole("heading", { name: "Progressive slab breakdown", exact: true })
    ).toHaveCount(count > 0 ? 1 : 0);
    await expect(cards.locator("dd")).toHaveText([...amounts]);
    await expect(page.getByTestId("annual-licence")).toHaveText(total);
  }
  const positions = await cards.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y };
    })
  );
  if ((page.viewportSize()?.width ?? 0) < 640) {
    expect(positions[1].x).toBe(positions[0].x);
    expect(positions[1].y).toBeGreaterThan(positions[0].y);
  } else {
    expect(positions[1].y).toBe(positions[0].y);
    expect(positions[1].x).toBeGreaterThan(positions[0].x);
  }
  await page.emulateMedia({ media: "print" });
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(2)).toBeVisible();
  await expect(page.locator(".pricing-slab-details summary")).toHaveCount(0);
  await expect(page.locator(".pricing-assumptions summary")).toHaveCount(0);
  await expect(page.locator(".pricing-assumptions li")).toHaveCount(4);
  await expect(page.locator(".pricing-assumptions strong")).toHaveText([
    "₹8,85,000",
    "₹73,750",
    "₹25,000 once",
  ]);
  const printInk = await page
    .locator("#live-estimate")
    .evaluate((element) => getComputedStyle(element).color);
  expect(
    await page
      .locator(".pricing-assumptions strong")
      .first()
      .evaluate((element) => getComputedStyle(element).color)
  ).toBe(printInk);
  await page.emulateMedia({ media: "screen" });
});
