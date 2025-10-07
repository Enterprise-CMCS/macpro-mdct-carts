import AxeBuilder from "@axe-core/playwright";
import { expect, Page } from "@playwright/test";

export async function e2eA11y(page: Page, url: string) {
  const breakpoints = {
    mobile: [560, 800],
    tablet: [880, 1000],
    desktop: [1200, 1200],
  };

  await page.goto(url);

  for (const size of Object.values(breakpoints)) {
    await page.setViewportSize({ width: size[0], height: size[1] });
    await page.locator("h1").first().waitFor({ state: "visible" });
    const results = await new AxeBuilder({ page })
      .withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ])
      .disableRules(["duplicate-id"])
      .analyze();
    await expect(results.violations).toEqual([]);
  }
}
