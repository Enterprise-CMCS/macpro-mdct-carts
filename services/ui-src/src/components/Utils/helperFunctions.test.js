import { showQuestionByPath } from "./helperFunctions";

describe("showQuestionsPath", () => {
  test("Should return true to disable page for print", () => {
    expect(showQuestionByPath("/print")).toEqual(true);
  });
  test("Should return false otherwise", () => {
    expect(showQuestionByPath("/section/")).toEqual(false);
  });
});
