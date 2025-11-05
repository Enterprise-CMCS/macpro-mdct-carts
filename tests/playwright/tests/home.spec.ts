import { test } from "@playwright/test";
import { e2eA11y } from "../utils";

test.describe("State user home page", () => {
  test.use({ storageState: ".auth/user.json" });
  test("is accessible", async ({ page }) => {
    await e2eA11y(page, "/");
  });
});
