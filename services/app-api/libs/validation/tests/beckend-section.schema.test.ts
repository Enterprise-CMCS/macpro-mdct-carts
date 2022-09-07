import { Validator } from "jsonschema";
import { sectionSchema } from "../backend-section.schema";

describe("Test schema validation", () => {
  test("Sections should validate correctly", () => {
    const sectionContents = {
      section: { id: "id", year: 2021, subsections: [] },
    };
    const validator = new Validator();
    const validationResults = validator.validate(
      sectionContents,
      sectionSchema
    );
    expect(validationResults.errors.length).toBe(0);
  });

  test("Invalid Sections should contain errors", () => {
    const sectionContents = {
      section: {
        badData: "this prop isn't normal",
      },
    };
    const validator = new Validator();
    const validationResults = validator.validate(
      sectionContents,
      sectionSchema
    );
    expect(validationResults.errors.length).toBeGreaterThan(0);
  });
});
