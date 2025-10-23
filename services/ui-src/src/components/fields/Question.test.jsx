import React from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
// components
import Question from "./Question";
// constants
import { lteMask } from "../../util/constants";
// types
import { AppRoles } from "../../types";
// utils
import {
  mockQuestionProps,
  mockQuestionTypes,
  mockQuestions,
} from "../../util/testing/mockQuestions.js";

// Mock Redux calls
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  connect: () => (Component) => Component,
}));

// Mock UploadComponent calls
jest.mock("../../util/fileApi", () => ({
  recordFileInDatabaseAndGetUploadUrl: jest.fn(),
  uploadFileToS3: jest.fn(),
  getFileDownloadUrl: jest.fn(),
  getUploadedFiles: jest.fn(),
  deleteUploadedFile: jest.fn(),
}));

// Question for specific conditionals
const questionId = "03-c-05-09";

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
                      ...mockQuestions["text"],
                      id: `2024-${questionId}`,
                      fieldset_info: {
                        id: `2024-${questionId}`,
                      },
                      questions: [
                        {
                          ...mockQuestions["integer"],
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
  // Mock TextField
  jest.mock("@cmsgov/design-system", () => {
    return {
      TextField: () => <div />,
    };
  });

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
const mockComponent = (path, spyFn, exported = "default") => {
  jest.doMock(path, () => ({
    __esModule: true,
    [exported]: function Mocked(props) {
      spyFn(props);
      return <div />;
    },
  }));
};

// Spies
const propSpies = Object.fromEntries(
  mockQuestionTypes.map((key) => [key, jest.fn()])
);

const baseProps = {
  hideNumber: false,
  prevYear: { value: 10 },
  printView: false,
};

describe("<Question />", () => {
  describe("All question types", () => {
    test.each(mockQuestionTypes)("%s renders without errors", async (key) => {
      const props = {
        ...baseProps,
        ...mockQuestionProps[key],
        question: mockQuestions[key],
      };

      useDispatch.mockReturnValue(mockDispatch);
      await act(async () => {
        renderQuestion(props);
      });

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
        ...mockQuestions["text"],
      },
    };

    test("renders without extra props", () => {
      mockComponent("./Text", propSpies["text"]);
      renderMockedQuestion(props);
      expect(propSpies["text"]).not.toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
          printView: false,
        })
      );
    });
  });

  describe("Integer question", () => {
    const props = {
      ...baseProps,
      question: {
        ...mockQuestions["integer"],
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
      props.question.mask = lteMask;
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
      props.question.mask = lteMask;
      renderQuestion(props);
      const group = screen.getByRole("group", {
        name: /Mock integer question/,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("<11");
    });

    test("renders Integer with extra props", () => {
      mockComponent("./Integer", propSpies["integer"]);
      renderMockedQuestion(props);
      expect(propSpies["integer"]).toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
          printView: true,
        })
      );
    });
  });

  describe("Fieldset question", () => {
    const props = {
      ...baseProps,
      question: mockQuestions["fieldset"],
    };

    test("renders Integer with extra props and Text without", () => {
      mockComponent("./Integer", propSpies["integer"]);
      mockComponent("./Text", propSpies["text"]);
      renderMockedQuestion(props);
      expect(propSpies["integer"]).toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
          printView: false,
        })
      );
      expect(propSpies["text"]).not.toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
          printView: false,
        })
      );
    });
  });

  const connectedComponentsExported = ["Objectives", "Repeatables"];

  describe.each(connectedComponentsExported)("%s question", (exported) => {
    const questionType = exported.toLowerCase();

    const props = {
      ...baseProps,
      question: {
        ...mockQuestions[questionType],
      },
      printView: true,
    };

    test("renders with extra props", () => {
      mockComponent(`./${exported}`, propSpies[questionType], exported);
      renderMockedQuestion(props);
      expect(propSpies[questionType]).toHaveBeenCalledWith(
        expect.objectContaining({
          printView: true,
        })
      );
    });
  });

  describe("Checkbox question with children", () => {
    const props = {
      ...baseProps,
      question: {
        ...mockQuestions["checkbox"],
        questions: [mockQuestions["integer"], mockQuestions["text"]],
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
