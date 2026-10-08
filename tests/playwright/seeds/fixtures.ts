import { ReportSection } from "../utils/requests";

type Visitor = (node: Record<string, any>) => void;

const walk = (node: unknown, visit: Visitor) => {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
  } else if (node && typeof node === "object") {
    visit(node as Record<string, any>);
    for (const key of Object.keys(node)) {
      walk((node as Record<string, any>)[key], visit);
    }
  }
};

/**
 * Sets the answer entry for the question whose id ends with `idSuffix`.
 * Question ids are year-prefixed (e.g. "2025-01-a-01-01"), so matching on the
 * suffix keeps seeds independent of the reporting year.
 */
export const setAnswerById = (
  sections: ReportSection[],
  idSuffix: string,
  value: unknown,
): ReportSection[] => {
  let found = false;
  walk(sections, (node) => {
    if (
      typeof node.id === "string" &&
      node.id.endsWith(idSuffix) &&
      node.answer
    ) {
      node.answer.entry = value;
      found = true;
    }
  });
  if (!found) {
    throw new Error(`No question found with id ending in "${idSuffix}"`);
  }
  return sections;
};

/** Sets the Basic State Information program type (e.g. "combo"). */
export const setProgramType = (
  sections: ReportSection[],
  value: "combo" | "medicaid_exp_chip" | "separate_chip" = "combo",
): ReportSection[] => {
  return setAnswerById(sections, "-00-a-01-02", value);
};

/**
 * Seeds a representative set of Section 1 (Medicaid Expansion) answers so the
 * UI can be asserted against pre-populated data.
 */
export const seedSection1Answers = (
  sections: ReportSection[],
): ReportSection[] => {
  setProgramType(sections, "combo");
  setAnswerById(sections, "-01-a-01-01", "no"); // Charge an enrollment fee? No
  setAnswerById(sections, "-01-a-01-02", "yes"); // Charge premiums? Yes
  setAnswerById(sections, "-01-a-01-05", ["mco"]); // Delivery system: Managed Care
  return sections;
};
