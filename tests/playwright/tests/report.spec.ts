import test, { expect } from "@playwright/test";
import { enterFirstReport, stateUserHomePageLoad } from "../utils";

test.describe("State user report tests", () => {
  test.use({ storageState: ".auth/user.json" });
  test("can open a report", async ({ page }) => {
    await stateUserHomePageLoad(page);
    await enterFirstReport(page);
    const reportTitle = page.locator('[data-testid="report-title"] h1');
    await expect(reportTitle).toBeVisible();
    await expect(reportTitle).toHaveText(/CARTS FY\d{4} Report/);
  });
});
