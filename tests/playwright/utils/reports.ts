import { Page } from "@playwright/test";
import { LOADING_IMG_ALT_TEXT } from "./constants";

export async function enterFirstReport(page: Page) {
  const firstEditLink = page
    .locator('[data-testid="report-action-button"]')
    .first();
  await firstEditLink.waitFor({ state: "visible" });
  await firstEditLink.click();

  const loader = page.getByRole("img", { name: LOADING_IMG_ALT_TEXT });
  if (await loader.isVisible().catch(() => false)) {
    await loader.waitFor({ state: "detached" });
  }
}
