import { test, expect } from "@playwright/test";
import { e2eA11y } from "../utils/a11y";

test.describe("State user home page", () => {
  test.use({ storageState: ".auth/user.json" });
  test("displays", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "CARTS Developer Login" })
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "All Reports" })
    ).toBeVisible();
  });

  test("is accessible", async ({ page }) => {
    await e2eA11y(page, "/");
  });
});
