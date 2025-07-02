import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Question from "./Question";
import { AppRoles } from "../../types";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

const mockStore = configureMockStore();

// Minimum store needed
const store = mockStore({
  formData: [
    {
      contents: {
        section: {
          year: 0,
          state: "KY",
        },
      },
    },
  ],
  reportStatus: {
    KY0: {},
  },
  stateUser: {
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 0,
  },
});

const TestComponent = (props) => (
  <Provider store={store}>
    <Question {...props} />
  </Provider>
);

describe("<Question />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("text question", () => {
    const props = {
      hideNumber: false,
      question: {
        type: "text",
        id: "1",
        label: "Mock text question",
        answer: { entry: "Mock answer" },
      },
      prevYear: { value: 10 },
      tableTitle: "",
      printView: false,
    };

    test("renders", () => {
      render(<TestComponent {...props} />);
      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock answer");
    });
  });

  describe("integer question", () => {
    const props = {
      hideNumber: false,
      question: {
        type: "integer",
        id: "2",
        label: "Mock integer question",
        answer: { entry: 0 },
      },
      prevYear: { value: 10 },
      tableTitle: "",
      printView: false,
    };

    test("renders correctly", async () => {
      render(<TestComponent {...props} />);
      const group = screen.getByRole("group", {
        name: "2. Mock integer question",
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("0");
    });
  });

  describe("fieldset question", () => {
    const props = {
      hideNumber: false,
      question: {
        type: "fieldset",
        fieldset_info: {},
        questions: [
          {
            type: "text",
            id: "1",
            label: "Mock text question",
            answer: { entry: "Mock answer" },
          },
          {
            type: "integer",
            id: "2",
            label: "Mock integer question",
            answer: { entry: 0 },
          },
        ],
      },
      prevYear: { value: 10 },
      tableTitle: "Mock fieldset title",
      printView: false,
    };

    test("renders correctly", async () => {
      render(<TestComponent {...props} />);
      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock answer");

      const group = screen.getByRole("group", {
        name: "2. Mock integer question",
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("0");
    });
  });

  describe("question with children", () => {
    const props = {
      hideNumber: false,
      question: {
        type: "checkbox",
        id: "1",
        label: "Mock checkbox question",
        name: "mock-checkbox",
        answer: {
          options: [
            {
              label: "Mock checkbox answer",
              value: "mock-checkbox-answer",
            },
          ],
        },
        questions: [
          {
            type: "text",
            id: "2",
            label: "Mock text question",
            answer: { entry: "Mock answer" },
          },
          {
            type: "integer",
            id: "3",
            label: "Mock integer question",
            answer: { entry: 0 },
          },
        ],
      },
      prevYear: { value: 10 },
      tableTitle: "",
      printView: false,
    };

    test("renders correctly", async () => {
      useDispatch.mockReturnValue(mockDispatch);
      render(<TestComponent {...props} />);

      const checkbox = screen.getByRole("checkbox", {
        name: "Question: Mock checkbox question, Answer: Mock checkbox answer",
      });
      expect(checkbox.value).toBe("mock-checkbox-answer");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(mockDispatch).toHaveBeenCalled();

      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock answer");

      await userEvent.type(input, "Changed mock answer");
      expect(mockDispatch).toHaveBeenCalled();

      const group = screen.getByRole("group", {
        name: "3. Mock integer question",
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("0");
    });
  });
});
