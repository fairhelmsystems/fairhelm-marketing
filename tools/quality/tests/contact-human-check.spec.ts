import { expect, test } from "@playwright/test";

// Local fixture traffic only: this verifies the shared client's retry protocol,
// not puzzle resistance, DNS cutover or actual email delivery.
for (const brand of ["squarecampus", "fairhelm"] as const) {
  test(`${brand} adaptive check reloads once before any enquiry is submitted`, async ({ page }) => {
    let boards = 0;
    let solves = 0;
    let contacts = 0;
    await page.route(/\/challenge(?:\/solve)?$/, async (route) => {
      if (new URL(route.request().url()).pathname.endsWith("/solve")) {
        solves++;
        const data = route.request().postDataJSON();
        expect(data.behaviour.via).toBe("keyboard");
        expect(data.behaviour.trace).toEqual([]);
        await route.fulfill({
          json: solves === 1 ? { ok: false, retry: true } : { ok: true, pass: "synthetic-pass" },
        });
      } else {
        boards++;
        await route.fulfill({
          json: {
            id: `synthetic-board-${boards}`,
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
            width: 440,
            height: 300,
            start: { x: 60, y: 60 },
            tolerance: 22,
          },
        });
      }
    });
    await page.route(
      brand === "squarecampus" ? "**/api/contact" : "**/inquiries",
      async (route) => {
        contacts++;
        expect(route.request().postDataJSON().humanToken).toBe("synthetic-pass");
        await route.fulfill({ json: { ok: true, id: "synthetic-enquiry" } });
      }
    );
    if (brand === "squarecampus") {
      await page.goto("http://localhost:3100/demo/");
      await page.locator('input[name="name"]').fill("Synthetic Person");
      await page.locator('input[name="email"]').fill("synthetic@example.test");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.locator('input[name="institution"]').fill("Synthetic School");
      await page.getByText("2–5 campuses", { exact: true }).click();
      await page.getByText("IT / Systems", { exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByText("Admissions-to-enrolment visibility", { exact: true }).click();
      await page
        .locator('textarea[name="message"]')
        .fill("Synthetic local browser test of the adaptive retry protocol.");
      await page.locator('input[name="consent"]').check();
      await page.waitForTimeout(2000);
      await page.locator('button[type="submit"]').click();
    } else {
      await page.goto("http://localhost:3102/contact/");
      await page.getByRole("button", { name: "SquareCampus", exact: true }).click();
      await page
        .getByLabel("What needs to work better?")
        .fill("Synthetic local browser test of the adaptive retry protocol.");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByPlaceholder("Name", { exact: true }).fill("Synthetic Person");
      await page.getByPlaceholder("School, trust, or company").fill("Synthetic School");
      await page.getByPlaceholder("you@organization.com").fill("synthetic@example.test");
      await page.getByLabel("Your role", { exact: true }).fill("Administrator");
      await page.getByLabel("Number of campuses", { exact: true }).selectOption("2–5 campuses");
      await page.waitForTimeout(3100);
      await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
    }
    const tile = page.getByRole("button", { name: /^Tile\./ });
    await tile.press("Enter");
    await expect(
      page.getByText("One more quick check. Here is a fresh board.", { exact: true })
    ).toBeVisible();
    expect(boards).toBe(2);
    expect(contacts).toBe(0);
    await expect(tile).toBeFocused();
    await tile.press("Enter");
    await expect(
      page.getByRole("heading", {
        name: brand === "squarecampus" ? "Request received" : "Inquiry received.",
        exact: true,
      })
    ).toBeVisible();
    expect(solves).toBe(2);
    expect(contacts).toBe(1);
  });
}
