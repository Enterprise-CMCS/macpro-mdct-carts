import { expect, Page } from "@playwright/test";

export async function stateUserHomePageLoad(page: Page) {
  await page.goto("/");
  await page.waitForResponse(
    (response) =>
      response.url().includes("state_status") && response.status() === 200
  );
  expect(page.getByRole("table")).toBeVisible();
}
