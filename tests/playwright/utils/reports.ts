import { Page } from "@playwright/test";
import { LOADING_IMG_ALT_TEXT } from "./constants";

export async function enterFirstReport(page: Page) {
  const reportEditLinks = await page.getByRole("link", { name: /Edit/ }).all();
  await reportEditLinks[0].click();
  await page
    .getByRole("img", { name: LOADING_IMG_ALT_TEXT })
    .waitFor({ state: "detached" }); // "detached" checks it's not in the DOM
}
