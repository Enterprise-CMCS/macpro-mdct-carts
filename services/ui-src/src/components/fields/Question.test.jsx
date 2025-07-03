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

const baseProps = {
  hideNumber: false,
  prevYear: { value: 10 },
  printView: false,
  tableTitle: "",
};

const renderWithStore = (props) =>
  render(
    <Provider store={store}>
      <Question {...props} />
    </Provider>
  );

const mockComponent = (path, spyFn) => {
  jest.doMock(path, () => ({
    __esModule: true,
    default: function Mocked(props) {
      spyFn(props);
      return <div />;
    },
  }));
};

const checkboxQuestion = {
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
};

const integerQuestion = {
  type: "integer",
  id: "2",
  label: "Mock integer question",
  answer: { entry: 12345 },
};

const textQuestion = {
  type: "text",
  id: "3",
  label: "Mock text question",
  answer: { entry: "Mock answer" },
};

describe("<Question />", () => {
  describe("Text question", () => {
    const props = {
      ...baseProps,
      question: textQuestion,
    };

    test("renders Text", () => {
      renderWithStore(props);
      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock answer");
    });

    test("renders without prevYear prop", () => {
      const textPropSpy = jest.fn();
      mockComponent("./Text", textPropSpy);

      jest.isolateModules(() => {
        const MockQuestion = require("./Question").default;
        render(
          <Provider store={store}>
            <MockQuestion {...props} />
          </Provider>
        );
      });

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
      question: integerQuestion,
    };

    test("renders Integer", async () => {
      renderWithStore(props);
      const group = screen.getByRole("group", {
        name: `${integerQuestion.id}. Mock integer question`,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("12345");
    });

    test("renders with prevYear prop", () => {
      const integerPropSpy = jest.fn();
      mockComponent("./Integer", integerPropSpy);

      jest.isolateModules(() => {
        const MockQuestion = require("./Question").default;
        render(
          <Provider store={store}>
            <MockQuestion {...props} />
          </Provider>
        );
      });

      expect(integerPropSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          prevYear: { value: 10 },
        })
      );
    });
  });

  describe("Fieldset question", () => {
    const props = {
      ...baseProps,
      question: {
        type: "fieldset",
        fieldset_info: {},
        questions: [textQuestion, integerQuestion],
      },
    };

    test("renders Text and Integer", async () => {
      renderWithStore(props);
      const input = screen.getByRole("textbox", { name: "Mock text question" });
      expect(input).toHaveValue("Mock answer");

      const group = screen.getByRole("group", {
        name: `${integerQuestion.id}. Mock integer question`,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("12345");
    });

    test("renders Integer with prevYear prop and Text without", () => {
      const integerPropSpy = jest.fn();
      const textPropSpy = jest.fn();
      mockComponent("./Integer", integerPropSpy);
      mockComponent("./Text", textPropSpy);

      jest.isolateModules(() => {
        const MockQuestion = require("./Question").default;
        render(
          <Provider store={store}>
            <MockQuestion {...props} />
          </Provider>
        );
      });

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

  describe("question with children", () => {
    const props = {
      ...baseProps,
      question: {
        ...checkboxQuestion,
        questions: [textQuestion, integerQuestion],
      },
    };

    test("renders correctly", async () => {
      useDispatch.mockReturnValue(mockDispatch);
      renderWithStore(props);

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
        name: `${integerQuestion.id}. Mock integer question`,
      });
      const numberInput = within(group).getByRole("textbox");
      expect(numberInput).toHaveValue("12345");
    });
  });
});
