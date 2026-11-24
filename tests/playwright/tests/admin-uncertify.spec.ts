import { ADMIN_USER_AUTH } from "../utils";
import { expect, test } from "./fixtures/base";

test.use({ storageState: ADMIN_USER_AUTH });

test.describe("Uncertifying a certified report", () => {
  test("An admin should be able to uncertify a certified report", async ({
    page,
    certifiedReport,
  }) => {
    const { state: STATE, year: YEAR } = certifiedReport;
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
        response.url().endsWith(`/state_status/${YEAR}/${STATE}`)
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
      })
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
  });
});
