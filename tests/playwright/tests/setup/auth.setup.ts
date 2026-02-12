import { expect, Page, test as setup } from "@playwright/test";
import { STATE_USER_HOME_HEADING } from "../../utils";

const stateUserAuthPath: string = ".auth/user.json";
const stateUser = process.env.CYPRESS_STATE_USER_EMAIL!;
const statePassword = process.env.CYPRESS_STATE_USER_PASSWORD!; // pragma: allowlist secret

/**
 * Fallback to UI authentication
 * @param page
 * @param username
 * @param password
 * @param expectedHeading
 * @param userType
 */
async function authenticateWithUI(
  page: Page,
  username: string,
  password: string,
  expectedHeading: string,
  userType: string
): Promise<void> {
  console.log(`Attempting UI authentication for ${userType}`);
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", { name: expectedHeading })
  ).toBeVisible({ timeout: 10000 });
  console.log(`✅ UI authentication successful for ${userType}`);
}

// State user authentication setup
setup("authenticate as user", async ({ page }) => {
  await authenticateWithUI(
    page,
    stateUser,
    statePassword,
    STATE_USER_HOME_HEADING,
    "state user"
  );
  await page.context().storageState({ path: stateUserAuthPath });
});
