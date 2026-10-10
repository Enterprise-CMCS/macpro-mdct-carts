import { Locator } from "@playwright/test";
import {
  STATE_USER_HOME_HEADING,
  checkDeliveryOption,
  clickQuestionButton,
  expectReportSaved,
  fillQuestionTextbox,
  sectionPart,
  selectRadioOption,
} from "../../utils";
import { BasePage } from "./base.page";

export class StatePage extends BasePage {
  get reportTitle(): Locator {
    return this.page.locator('[data-testid="report-title"] h1');
  }

  get autosave(): Locator {
    return this.page.getByTestId("autosave");
  }

  async goToHome() {
    await this.page.goto("/");
    await this.page
      .getByRole("heading", { name: STATE_USER_HOME_HEADING })
      .waitFor({ state: "visible" });
    await this.page
      .getByRole("table", { name: "All Reports" })
      .waitFor({ state: "visible" });
  }

  /** Opens a report directly at its first section. */
  async openReport(year: number) {
    await this.page.goto(`/sections/${year}/00`);
    await this.waitForReportLoad();
    await this.reportTitle.waitFor({ state: "visible" });
  }

  async goToSection1() {
    await this.page.getByRole("link", { name: /^Section 1:/ }).click();
    await this.waitForReportLoad();
    await this.page
      .getByTestId("question-legend")
      .filter({ hasText: "Does your program charge an enrollment fee" })
      .first()
      .waitFor({ state: "visible" });
  }

  /**
   * A combo program renders Section 1 as multiple parts with duplicate labels,
   * so interactions are scoped to the Medicaid Expansion part.
   */
  medicaidExpansionPart(): Locator {
    return sectionPart(this.page, "Medicaid Expansion CHIP Enrollment Fees");
  }

  fieldByLabel(label: string | RegExp): Locator {
    return this.page.getByRole("textbox", { name: label });
  }

  async fillField(label: string | RegExp, value: string) {
    const field = this.fieldByLabel(label);
    await field.waitFor({ state: "visible" });
    await field.fill(value);
    await field.blur();
  }

  async expectSaved() {
    await expectReportSaved(this.page);
  }

  /** Fills the Medicaid Expansion part of Section 1. */
  async fillSection1() {
    const part = this.medicaidExpansionPart();

    // Question 1 - enrollment fee: toggle Yes then back to No
    await selectRadioOption(
      part,
      "Does your program charge an enrollment fee",
      "Yes"
    );
    await selectRadioOption(
      part,
      "Does your program charge an enrollment fee",
      "No"
    );

    // Question 2 - premiums
    await selectRadioOption(part, "Does your program charge premiums", "Yes");

    // Question 2a - premiums tiered for one child
    await selectRadioOption(
      part,
      "Are your premiums for one child tiered",
      "Yes"
    );

    // Question 2b - premium / FPL ranges for one child
    const oneChildRange =
      "Indicate the range for premiums and corresponding FPL for one child";
    await fillQuestionTextbox(part, oneChildRange, "0", "FPL starts at");
    await fillQuestionTextbox(part, oneChildRange, "10", "FPL ends at");
    await fillQuestionTextbox(part, oneChildRange, "22", "Premium starts at");
    await fillQuestionTextbox(part, oneChildRange, "44", "Premium ends at");
    await clickQuestionButton(part, oneChildRange, /Add another/);
    await clickQuestionButton(part, oneChildRange, /Remove Last/);

    // Question 3 - maximum family premium: toggle Yes then No to reveal 3b
    await selectRadioOption(
      part,
      "Is the maximum premium a family would be charged each year tiered",
      "Yes"
    );
    await selectRadioOption(
      part,
      "Is the maximum premium a family would be charged each year tiered",
      "No"
    );

    // Question 3b - maximum family premium amount
    await fillQuestionTextbox(
      part,
      "What's the maximum premium a family would be charged each year",
      "123"
    );

    // Question 4 - premium differences explanation (text questions have no
    // legend, so target the textarea by its accessible name)
    const q4 = part.getByRole("textbox", { name: /Do premiums differ/ });
    await q4.fill("The premium differences are simply inexplicable.");
    await q4.blur();

    // Question 5 - delivery systems
    const deliveryLegend = "Which delivery system(s) does your state use";
    await checkDeliveryOption(part, deliveryLegend, /Managed Care/);
    await checkDeliveryOption(part, deliveryLegend, /Primary Care Case/);
  }
}
