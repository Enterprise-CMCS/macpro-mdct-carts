import { Page } from "@playwright/test";
import { LOADING_IMG_ALT_TEXT } from "./constants";

export async function enterFirstReport(page: Page) {
  // Any concerns this data-testid could be modified or removed?
  const firstEditLink = page
    .locator('[data-testid="report-action-button"]')
    .first();
  await firstEditLink.waitFor({ state: "visible" });
  await firstEditLink.click();

  // I need to run it locally, but pretty sure this would be more stable when waiting for the loader
  const loader = page.getByRole("img", { name: LOADING_IMG_ALT_TEXT });
  if (await loader.isVisible().catch(() => false)) {
    await loader.waitFor({ state: "detached" });
  }
}
