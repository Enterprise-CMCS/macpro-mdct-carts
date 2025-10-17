import test, { expect } from "@playwright/test";
import { enterFirstReport, stateUserHomePageLoad } from "../utils";

test.describe("State user report tests", () => {
  test.use({ storageState: ".auth/user.json" });
  test("can open a report", async ({ page }) => {
    await stateUserHomePageLoad(page);
    await enterFirstReport(page);
    expect(
      page.getByRole("heading", { name: /CARTS FY\d{4} Report/ })
    ).toBeVisible();
  });
});
