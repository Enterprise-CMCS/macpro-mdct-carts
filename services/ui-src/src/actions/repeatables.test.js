import { thunk } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { createNewRepeatable, SET_FRAGMENT } from "./repeatables";
import { selectById } from "../store/selectors";

jest.mock("../store/selectors", () => ({
  selectById: jest.fn(),
}));

const mockStore = configureMockStore([thunk]);

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

const getAllAnswerEntries = (node, entries = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => getAllAnswerEntries(child, entries));
  } else if (node && typeof node === "object") {
    if (node.answer && "entry" in node.answer) {
      entries.push(node.answer.entry);
    }
    Object.values(node).forEach((child) => getAllAnswerEntries(child, entries));
  }
  return entries;
};

describe("createNewRepeatable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clears all answers in the newly added repeatable item", () => {
    selectById.mockReturnValue(buildParent());
    const store = mockStore({});

    store.dispatch(createNewRepeatable(parentId));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(SET_FRAGMENT);

    const newItem = actions[0].value.questions.at(-1);
    const entries = getAllAnswerEntries(newItem);

    expect(entries.length).toBeGreaterThan(0);
    entries.forEach((entry) => expect(entry).toBeNull());
  });

  test("does not modify the answers of the original item", () => {
    selectById.mockReturnValue(buildParent());
    const store = mockStore({});

    store.dispatch(createNewRepeatable(parentId));

    const originalItem = store.getActions()[0].value.questions[0];

    expect(originalItem.questions[0].answer.entry).toBe("HSI Program 1 name");
  });
});
