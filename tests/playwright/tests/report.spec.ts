import { expect, test } from "./fixtures/base";

test.describe("State user report", () => {
  // These tests edit the same seeded report, so run them in order to avoid
  // autosave collisions from concurrent edits.
  test.describe.configure({ mode: "serial" });

  test("opens a combo report", async ({ statePage, comboReport }) => {
    // Arrange: comboReport fixture set the program type via the API.
    // Act
    await statePage.openReport(comboReport.year);
    // Assert
    await expect(statePage.reportTitle).toHaveText(
      new RegExp(`CARTS FY${comboReport.year} Report`),
    );
  });

  test("renders Section 1 answers seeded through the API", async ({
    statePage,
    section1SeededReport,
  }) => {
    // Arrange: section1SeededReport fixture seeded answers via the API.
    // Act
    await statePage.openReport(section1SeededReport.year);
    await statePage.goToSection1();
    const part = statePage.medicaidExpansionPart();

    // Assert the seeded answers are reflected in the UI
    const enrollmentFee = part
      .locator(".question", {
        has: part
          .page()
          .getByTestId("question-legend")
          .filter({ hasText: "Does your program charge an enrollment fee" }),
      })
      .last();
    await expect(
      enrollmentFee.getByRole("radio", { name: "No" }),
    ).toBeChecked();

    const premiums = part
      .locator(".question", {
        has: part
          .page()
          .getByTestId("question-legend")
          .filter({ hasText: "Does your program charge premiums" }),
      })
      .last();
    await expect(
      premiums.getByRole("radio", { name: "Yes" }).first(),
    ).toBeChecked();

    await expect(
      part.getByRole("checkbox", { name: /Managed Care/ }),
    ).toBeChecked();
  });

  test("edits a report field and autosaves", async ({
    statePage,
    comboReport,
  }) => {
    // Act
    await statePage.openReport(comboReport.year);
    const newValue = `Playwright Test Program ${Date.now()}`;
    await statePage.fillField("CHIP program name(s):", newValue);

    // Assert
    await statePage.expectSaved();
    await statePage.page.reload();
    await statePage.waitForReportLoad();
    await expect(statePage.fieldByLabel("CHIP program name(s):")).toHaveValue(
      newValue,
    );
  });

  test("fills out Section 1 in the UI", async ({ statePage, comboReport }) => {
    // This test makes many sequential edits, each triggering an autosave.
    test.slow();

    // Act
    await statePage.openReport(comboReport.year);
    await statePage.goToSection1();
    await statePage.fillSection1();

    // Assert
    await statePage.expectSaved();
  });
});
