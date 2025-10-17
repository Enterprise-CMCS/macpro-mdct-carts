import { Page } from "@playwright/test";
import { STATE_USER_HOME_HEADING } from "./constants";

export async function stateUserHomePageLoad(page: Page) {
  await page.goto("/");
  await page
    .getByRole("heading", { name: STATE_USER_HOME_HEADING })
    .waitFor({ state: "visible" });
  await page
    .getByRole("table", { name: "All Reports" })
    .waitFor({ state: "visible" });
}
