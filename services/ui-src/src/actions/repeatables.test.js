import { createNewRepeatable, SET_FRAGMENT } from "./repeatables";
import { selectById } from "../store/selectors";

jest.mock("../store/selectors", () => ({
  selectById: jest.fn(),
}));

describe("createNewRepeatable", () => {
  const parentId = "2026-03-i-02-01";

  const buildParent = () => ({
    id: parentId,
    questions: [
      {
        id: "2026-03-i-02-01-01",
        type: "repeatable",
        questions: [
          {
            id: "2026-03-i-02-01-01-01",
            type: "text",
            answer: { entry: "HSI Program 1 name" },
          },
          {
            id: "2026-03-i-02-01-01-02",
            type: "text_multiline",
            answer: { entry: "Some long answer" },
          },
          {
            id: "2026-03-i-02-01-01-03",
            type: "checkbox",
            answer: { entry: ["option-a", "option-b"] },
          },
          {
            id: "2026-03-i-02-01-01-nested",
            type: "repeatables",
            questions: [
              {
                id: "2026-03-i-02-01-01-04",
                type: "text",
                answer: { entry: "Nested answer" },
              },
            ],
          },
        ],
      },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clears all answers in the newly added repeatable item", () => {
    const parent = buildParent();
    selectById.mockReturnValue(parent);

    const dispatch = jest.fn();
    const getState = jest.fn(() => ({}));

    createNewRepeatable(parentId)(dispatch, getState);

    expect(dispatch).toHaveBeenCalledTimes(1);
    const action = dispatch.mock.calls[0][0];
    expect(action.type).toBe(SET_FRAGMENT);

    const newItem = action.value.questions.at(-1);

    // Every answer.entry in the new item should be null (not carried over).
    const entries = [];
    const collectEntries = (node) => {
      if (Array.isArray(node)) {
        node.forEach(collectEntries);
      } else if (node && typeof node === "object") {
        if (node.answer && "entry" in node.answer) {
          entries.push(node.answer.entry);
        }
        Object.values(node).forEach(collectEntries);
      }
    };
    collectEntries(newItem);

    expect(entries.length).toBeGreaterThan(0);
    entries.forEach((entry) => expect(entry).toBeNull());
  });

  it("does not modify the answers of the original item", () => {
    const parent = buildParent();
    selectById.mockReturnValue(parent);

    const dispatch = jest.fn();
    const getState = jest.fn(() => ({}));

    createNewRepeatable(parentId)(dispatch, getState);

    const action = dispatch.mock.calls[0][0];
    const originalItem = action.value.questions[0];

    expect(originalItem.questions[0].answer.entry).toBe("HSI Program 1 name");
  });
});
