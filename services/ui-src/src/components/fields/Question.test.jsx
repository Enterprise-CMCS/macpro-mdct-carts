import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Question, { questionTypes } from "./Question";
import { AppRoles } from "../../types";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

// Question with specific conditionals
const questionId = "03-c-05-09";
// Temporarily exclude these question types
const excludedTypes = ["file_upload", "objectives", "repeatables"];

// Mocks for all other question types
const types = Array.from(questionTypes.keys()).filter(
  (key) => !excludedTypes.includes(key)
);
const questions = Object.fromEntries(types.map((key) => [key, {}]));
const questionProps = Object.fromEntries(types.map((key) => [key, {}]));
types.forEach((type, index) => {
  questions[type] = {
    id: `${index + 1}`,
    type,
    label: `Mock ${type} question`,
    name: `mock-${type}`,
    answer: {},
  };
});

["checkbox", "radio"].forEach((type) => {
  questions[type] = {
    ...questions[type],
    answer: {
      options: [
        {
          label: `Mock ${type} answer`,
          value: `mock-${type}-answer`,
        },
      ],
    },
  };
});

[
  "checkbox_flag",
  "email",
  "text",
  "text_medium",
  "text_multiline",
  "text_small",
].forEach((type) => {
  questions[type] = {
    ...questions[type],
    answer: { entry: `Mock ${type} answer` },
  };
});
questionProps["checkbox_flag"] = {
  onChange: () => {},
};

["integer", "money", "phone_number", "percentage"].forEach((type) => {
  questions[type] = {
    ...questions[type],
    answer: { entry: 5555555555 },
  };
});

questions["fieldset"] = {
  ...questions["fieldset"],
  fieldset_info: {
    id: "mock-fieldset_info",
  },
  questions: [questions["integer"], questions["text"]],
};

questions["daterange"] = {
  ...questions["daterange"],
  answer: {
    entry: "Mock daterange answer",
    labels: ["Mock daterange start", "Mock daterange end"],
  },
};
questionProps["daterange"] = {
  onChange: () => {},
};

questions["ranges"] = {
  ...questions["ranges"],
  answer: {
    entry: [],
    entry_max: "",
    entry_min: "",
    header: "",
    range_categories: [[]],
    range_type: [],
  },
};
questionProps["ranges"] = {
  onChange: () => {},
};

questions["repeatables"] = {
  ...questions["repeatables"],
  questions: [questions["integer"], questions["text"]],
};
questionProps["repeatables"] = {
  addRepeatableTo: () => {},
  disabled: false,
  removeRepeatableFrom: () => {},
};

questions["skip_text"] = {
  ...questions["text"],
  skip_text: "Mock skip text",
};

// Minimum store needed
const mockStore = configureMockStore();
const store = mockStore({
  // Mocked for getValueFromLastYear
  lastYearFormData: [
    {},
    {},
    {},
    {
      contents: {
        section: {
          year: 2024,
          state: "KY",
          subsections: [
            {},
            {},
            {
              parts: [
                {},
                {},
                {},
                {},
                {
                  questions: [
                    {
                      ...questions["text"],
                      id: `2024-${questionId}`,
                      fieldset_info: {
                        id: `2024-${questionId}`,
                      },
                      questions: [
                        {
                          ...questions["integer"],
                          answer: { entry: null },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ],
  formData: [
    {
      contents: {
        section: {
          year: 2025,
          state: "KY",
        },
      },
    },
  ],
  reportStatus: {
    KY2025: {},
  },
  stateUser: {
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 2025,
  },
});

// Render without mocks
const renderQuestion = (props) =>
  render(
    <Provider store={store}>
      <Question {...props} />
    </Provider>
  );

// Isolate render so mocked child components are clean
const renderMockedQuestion = (props) => {
  jest.isolateModules(() => {
    // Question has to be re-imported
    const Question = require("./Question").default;
    return render(
      <Provider store={store}>
        <Question {...props} />
      </Provider>
    );
  });
};

// Helper to mock child components
const mockComponent = (path, spyFn) => {
  jest.doMock(path, () => ({
    __esModule: true,
    default: function Mocked(props) {
      spyFn(props);
      return <div />;
    },
  }));
};

// Spies
const integerPropSpy = jest.fn();
const textPropSpy = jest.fn();

const baseProps = {
  hideNumber: false,
  prevYear: { value: 10 },
  printView: false,
};

describe("<Question />", () => {
  describe("All question types", () => {
    test.each(types)("%s renders without errors", async (key) => {
      const props = {
        ...baseProps,
        ...questionProps[key],
        question: questions[key],
      };

      useDispatch.mockReturnValue(mockDispatch);
      renderQuestion(props);

      const checkbox = screen.queryAllByRole("checkbox")[0];
      if (checkbox) {
        await userEvent.click(checkbox);
        expect(mockDispatch).toHaveBeenCalled();
      }

      const textbox = screen.queryAllByRole("textbox")[0];
      if (textbox) {
        await userEvent.type(textbox, "Change");
        expect(mockDispatch).toHaveBeenCalled();
      }
    });
  });

  describe("Text question", () => {
    const props = {
      ...baseProps,
      question: {
        ...questions["text"],
        id: `2025-${questionId}`,
      },
    };

    test("renders Text", () => {
      renderQuestion(props);
      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock text answer");
    });

    test("renders without prevYear prop", () => {
      mockComponent("./Text", textPropSpy);
      renderMockedQuestion(props);
      expect(textPropSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
        })
      );
    });
  });

  describe("Integer question", () => {
    const props = {
      ...baseProps,
      question: {
        ...questions["integer"],
        id: `2025-${questionId}-a`,
      },
      printView: true,
    };

    test("renders current value", () => {
      renderQuestion(props);
      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("5555555555");
    });

    test("renders current value with mask", () => {
      props.question.answer = { entry: 10 };
      props.question.mask = "lessThanEleven";
      renderQuestion(props);
      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("<11");
    });

    test("renders prevYear value", () => {
      props.question.answer = { entry: null };
      props.question.mask = undefined;
      renderQuestion(props);
      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("10");
    });

    test("renders prevYear value with mask", () => {
      props.question.mask = "lessThanEleven";
      renderQuestion(props);
      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("<11");
    });
  });

  describe("Fieldset question", () => {
    const props = {
      ...baseProps,
      question: questions["fieldset"],
    };

    test("renders Integer with prevYear prop and Text without", () => {
      mockComponent("./Integer", integerPropSpy);
      mockComponent("./Text", textPropSpy);
      renderMockedQuestion(props);
      expect(integerPropSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
        })
      );
      expect(textPropSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
        })
      );
    });
  });

  describe("Checkbox question with children", () => {
    const props = {
      ...baseProps,
      question: {
        ...questions["checkbox"],
        questions: [questions["integer"], questions["text"]],
      },
    };

    test("renders correctly", () => {
      renderQuestion(props);

      const checkbox = screen.getByRole("checkbox", {
        name: "Question: Mock checkbox question, Answer: Mock checkbox answer",
      });
      expect(checkbox.value).toBe("mock-checkbox-answer");
      expect(checkbox).not.toBeChecked();

      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock text answer");

      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("5555555555");
    });
  });
});
