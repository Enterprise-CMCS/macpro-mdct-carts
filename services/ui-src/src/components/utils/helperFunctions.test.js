import { generateQuestionNumber, showQuestionByPath } from "./helperFunctions";

describe("generateQuestionNumber()", () => {
  test("return only number", () => {
    expect(generateQuestionNumber("1")).toBe("1. ");
  });
  test("return last number", () => {
    expect(generateQuestionNumber("2025-03-c-05-09")).toBe("9. ");
  });
  test("return last number and letter", () => {
    expect(generateQuestionNumber("2025-03-c-05-09-a")).toBe("9a. ");
  });
  test("return empty string for malformed input", () => {
    expect(generateQuestionNumber("2025-03-c-05-09-a-b")).toBe("");
  });
  test("return empty string for empty input", () => {
    expect(generateQuestionNumber()).toBe("");
  });
});

describe("showQuestionsPath()", () => {
  test("Should return true to disable page for print", () => {
    expect(showQuestionByPath("/print")).toEqual(true);
  });
  test("Should return false otherwise", () => {
    expect(showQuestionByPath("/section/")).toEqual(false);
  });
});
