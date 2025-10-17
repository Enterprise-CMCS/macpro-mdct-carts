import { Page } from "@playwright/test";

export async function stateUserHomePageLoad(page: Page) {
  await page.goto("/");
  await page.getByRole("table").waitFor();
}
