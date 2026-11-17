/* eslint-disable no-empty-pattern */
// Playwright requires fixture functions to destructure their first argument.
// See https://playwright.dev/docs/test-fixtures#accessing-built-in-fixtures
import { test as base } from "@playwright/test";
import { STATE_ABBREVIATION, STATE_USER_AUTH } from "../../utils";
import {
  getReport,
  getReportStatuses,
  saveReport,
  updateReportStatus,
} from "../../utils/requests";
import { seedSection1Answers, setProgramType } from "../../seeds/fixtures";
import { StatePage } from "../pageObjects/state.page";

type SeededReport = { year: number; state: string };

type CustomFixtures = {
  statePage: StatePage;
  comboReport: SeededReport;
  section1SeededReport: SeededReport;
  submittableReport: SeededReport;
};

const TEST_USERNAME = "Playwright E2E";

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

/**
 * Finds the most recent in-progress or certified report for a state and makes
 * sure it is in progress, so a run that stopped mid-submission does not leave
 * the report locked.
 */
const resolveSubmittableReportYear = async (state: string): Promise<number> => {
  const statuses = await getReportStatuses();
  const candidates = statuses.filter(
    (status) =>
      status.stateId === state &&
      ["in_progress", "certified"].includes(status.status) &&
      !status.archived
  );

  if (candidates.length === 0) {
    throw new Error(`No in-progress or certified report found for ${state}`);
  }
  const latest = candidates.reduce((a, b) => (b.year > a.year ? b : a));
  if (latest.status !== "in_progress") {
    await updateReportStatus(latest.year, state, "in_progress", TEST_USERNAME);
  }
  return latest.year;
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

  // Arrange: an in-progress report that the test may certify and submit.
  // Teardown returns it to in progress so other tests (including Cypress)
  // still have an editable report, even if the test fails.
  submittableReport: async ({}, use) => {
    const state = STATE_ABBREVIATION;
    const year = await resolveSubmittableReportYear(state);
    await use({ year, state });
    await updateReportStatus(year, state, "in_progress", TEST_USERNAME);
  },
});

export * from "@playwright/test";
