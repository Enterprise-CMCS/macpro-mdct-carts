import { Page } from "@playwright/test";
import { LOADING_IMG_ALT_TEXT } from "../../utils";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForReportLoad() {
    const loader = this.page.getByRole("img", { name: LOADING_IMG_ALT_TEXT });
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: "detached" });
    }
  }

  async waitForResponse(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    status: number
  ) {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes(endpoint) &&
        response.request().method() === method &&
        response.status() === status
    );
  }
}
