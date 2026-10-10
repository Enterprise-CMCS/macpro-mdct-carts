/* eslint-disable no-empty-pattern */
// Playwright requires fixture functions to destructure their first argument.
// See https://playwright.dev/docs/test-fixtures#accessing-built-in-fixtures
import { test as base } from "@playwright/test";
import { STATE_ABBREVIATION, STATE_USER_AUTH } from "../../utils";
import { getReport, getReportStatuses, saveReport } from "../../utils/requests";
import { seedSection1Answers, setProgramType } from "../../seeds/fixtures";
import { StatePage } from "../pageObjects/state.page";

type SeededReport = { year: number; state: string };

type CustomFixtures = {
  statePage: StatePage;
  comboReport: SeededReport;
  section1SeededReport: SeededReport;
};

/** Finds the most recent in-progress report for a state. */
const resolveReportYear = async (state: string): Promise<number> => {
  const statuses = await getReportStatuses();
  const years = statuses
    .filter(
      (status) =>
        status.stateId === state &&
        status.status === "in_progress" &&
        !status.archived
    )
    .map((status) => status.year);

  if (years.length === 0) {
    throw new Error(`No in-progress report found for state ${state}`);
  }
  return Math.max(...years);
};

export const test = base.extend<CustomFixtures>({
  statePage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STATE_USER_AUTH });
    const page = await context.newPage();
    await use(new StatePage(page));
    await page.close();
    await context.close();
  },

  // Arrange: ensure the report is a combo program via the API.
  comboReport: async ({}, use) => {
    const state = STATE_ABBREVIATION;
    const year = await resolveReportYear(state);
    const sections = await getReport(year, state);
    setProgramType(sections, "combo");
    await saveReport(year, state, sections);
    await use({ year, state });
  },

  // Arrange: seed a combo report with representative Section 1 answers.
  section1SeededReport: async ({}, use) => {
    const state = STATE_ABBREVIATION;
    const year = await resolveReportYear(state);
    const sections = await getReport(year, state);
    seedSection1Answers(sections);
    await saveReport(year, state, sections);
    await use({ year, state });
  },
});

export * from "@playwright/test";
