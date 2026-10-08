import { expect, Locator, Page } from "@playwright/test";
import { LOADING_IMG_ALT_TEXT } from "./constants";

export async function waitForReportLoad(page: Page) {
  const loader = page.getByRole("img", { name: LOADING_IMG_ALT_TEXT });
  if (await loader.isVisible().catch(() => false)) {
    await loader.waitFor({ state: "detached" });
  }
}

export async function enterFirstReport(page: Page) {
  const firstEditLink = page
    .locator('[data-testid="report-action-button"]')
    .first();
  await firstEditLink.waitFor({ state: "visible" });
  await firstEditLink.click();

  await waitForReportLoad(page);
}

export async function fillReportTextField(
  page: Page,
  label: string | RegExp,
  value: string,
) {
  const field = page.getByRole("textbox", { name: label });
  await field.waitFor({ state: "visible" });
  await field.fill(value);
  await field.blur();
}

export async function expectReportSaved(page: Page) {
  const autosave = page.getByTestId("autosave");
  await expect(autosave).not.toContainText("Saving", { timeout: 30000 });
  await expect(autosave).toContainText(/Saved|Last saved/, { timeout: 30000 });
}

/**
 * Scope a locator to the innermost question (within `scope`) whose legend
 * matches `legend`. Nested questions share ancestors, so the innermost (last in
 * DOM order) match is the specific question being targeted.
 */
export function questionByLegend(
  scope: Page | Locator,
  legend: string | RegExp,
): Locator {
  const page = "page" in scope ? scope.page() : scope;
  return scope
    .locator(".question")
    .filter({
      has: page.getByTestId("question-legend").filter({ hasText: legend }),
    })
    .last();
}

/**
 * A combo program renders Section 1 as multiple parts that share question
 * labels, so interactions must be scoped to a single part.
 */
export function sectionPart(page: Page, title: string | RegExp): Locator {
  return page.locator('[data-testid="part"]').filter({
    has: page.getByTestId("part-h2-header").filter({ hasText: title }),
  });
}

export async function goToSection1(page: Page) {
  await page.getByRole("link", { name: /^Section 1:/ }).click();
  await waitForReportLoad(page);
  await page
    .getByTestId("question-legend")
    .filter({ hasText: "Does your program charge an enrollment fee" })
    .first()
    .waitFor({ state: "visible" });
}

export async function selectRadioOption(
  scope: Page | Locator,
  legend: string | RegExp,
  option: string | RegExp,
) {
  // A question's own options precede any nested (conditionally revealed)
  // child questions in the DOM, so target the first match.
  await questionByLegend(scope, legend)
    .getByRole("radio", { name: option })
    .first()
    .check();
}

export async function checkDeliveryOption(
  scope: Page | Locator,
  legend: string | RegExp,
  option: string | RegExp,
) {
  await questionByLegend(scope, legend)
    .getByRole("checkbox", { name: option })
    .check();
}

export async function fillQuestionTextbox(
  scope: Page | Locator,
  legend: string | RegExp,
  value: string,
  name?: string | RegExp,
) {
  const textbox = questionByLegend(scope, legend).getByRole("textbox", {
    name,
  });
  await textbox.fill(value);
  await textbox.blur();
}

export async function clickQuestionButton(
  scope: Page | Locator,
  legend: string | RegExp,
  name: string | RegExp,
) {
  await questionByLegend(scope, legend).getByRole("button", { name }).click();
}
