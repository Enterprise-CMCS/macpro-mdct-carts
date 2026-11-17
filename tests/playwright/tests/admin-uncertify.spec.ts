import { expect, test } from "@playwright/test";
import { ADMIN_USER_AUTH, STATE_USER_AUTH } from "../utils";
import { updateReportStatus } from "../utils/requests";

// Certifies AL 2025 through the API before the test, then uncertifies it in the
// UI. The report is left In Progress afterward, and the beforeAll resets it.
const STATE = "AL";
const YEAR = 2025;

test.use({ storageState: ADMIN_USER_AUTH });

test.describe("Admin user uncertifies a certified report", () => {
  test.beforeAll(async () => {
    // Certify a report through the API as the state user
    await updateReportStatus(
      YEAR,
      STATE,
      "certified",
      process.env.CYPRESS_STATE_USER_EMAIL!,
      STATE_USER_AUTH,
    );
  });

  test("admin uncertifies a certified report", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    const uncertifyButton = page.getByRole("button", {
      name: `Uncertify ${STATE} ${YEAR} report`,
    });
    await expect(uncertifyButton).toBeVisible();
    await uncertifyButton.click();

    // The design-system Dialog has no accessible name, so match the open <dialog> by its heading
    const dialog = page
      .locator("dialog[open]")
      .filter({ hasText: `Uncertify ${STATE} ${YEAR} report?` });
    await expect(dialog).toBeVisible();
    const uncertifyResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().endsWith(`/state_status/${YEAR}/${STATE}`),
    );
    await dialog
      .getByRole("button", { name: `Uncertify ${STATE} ${YEAR} report` })
      .click();

    const response = await uncertifyResponse;
    expect(response.status()).toBe(200);
    expect(response.request().postDataJSON()).toEqual(
      expect.objectContaining({
        status: "in_progress",
        state: STATE,
        year: YEAR,
      }),
    );

    // The UI reloads after uncertifying, so the report should now be In Progress
    const row = page
      .getByRole("table", { name: "All Reports" })
      .getByRole("row")
      .filter({
        has: page.getByRole("link", {
          name: `Print ${STATE} ${YEAR} report`,
        }),
      });
    await expect(row).toContainText("In Progress");
    await expect(uncertifyButton).toHaveCount(0);

    expect(pageErrors).toEqual([]);
  });
});
