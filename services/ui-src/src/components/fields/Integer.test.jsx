import React from "react";
import { Provider } from "react-redux";
//testing
import configureMockStore from "redux-mock-store";
import { screen, render, fireEvent } from "@testing-library/react";
//components
import Integer from "./Integer";
//utils
import { lteMask } from "../../util/constants";

const mockStore = configureMockStore();
const lastYearFormData = [
  {},
  {},
  {},
  {
    contents: {
      section: {
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
                    fieldset_info: {
                      id: "2022-03-c-05-03",
                    },
                    questions: [{ answer: { entry: 3000 } }],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
];
const store = mockStore({ lastYearTotals: { 2022: [] }, lastYearFormData });
const buildInteger = (intProps) => {
  return (
    <Provider store={store}>
      <Integer onChange={() => {}} {...intProps} />
    </Provider>
  );
};

describe("<Integer />", () => {
  test("should render correctly", () => {
    const props = {
      question: { id: "2023-00-a-01-01", label: "2023 question 1", answer: 1 },
    };
    render(buildInteger(props));
    expect(
      screen.getByRole("textbox", { name: "1. 2023 question 1" })
    ).toBeVisible();
  });

  test("should render Previous Year data correctly", () => {
    const props = {
      question: {
        id: "2022-00-a-01-01",
        label: "2022 question 1",
        answer: { entry: 0 },
      },
    };
    render(buildInteger(props));
    expect(
      screen.getByRole("textbox", { name: "1. 2022 question 1" })
    ).toBeVisible();
  });

  test("should render an Integer", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: 123 },
      },
    };
    render(buildInteger(props));
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();

    props.question.answer.entry = 0;
    render(buildInteger(props));
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
  });

  test("should update new numbers", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: 123 },
      },
    };

    render(buildInteger(props));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: 234 } });
    expect(screen.getByDisplayValue("234")).toBeInTheDocument();
  });

  test("should filter out non-numbers", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: "hope" },
      },
    };

    render(buildInteger(props));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "raw text" } });
    expect(screen.queryByDisplayValue("raw text")).not.toBeInTheDocument();
    expect(
      screen.getByText("Please enter whole numbers only")
    ).toBeInTheDocument();
  });

  test("should show <11 if passed >0 and <=10 with printView and lessThanEleven", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: "5" },
        mask: lteMask,
      },
      printView: true,
    };

    render(buildInteger(props));
    expect(screen.getByDisplayValue("<11")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("5")).not.toBeInTheDocument();
  });

  test("should show original answer if passed >=11 with printView and lessThanEleven mask", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: "12" },
        mask: lteMask,
      },
      printView: true,
    };

    render(buildInteger(props));
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
  });

  test("should show original answer if passed 0 with printView and lessThanEleven mask", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "Example Question",
        answer: { entry: "0" },
        mask: lteMask,
      },
      printView: true,
    };

    render(buildInteger(props));
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
  });

  test("should render previous year value for appropriate 3c part 5 or 6 questions", () => {
    const props = {
      question: {
        id: "2023-03-c-05-03-a",
        label: "How much?",
        answer: { entry: null },
      },
    };

    render(buildInteger(props));

    expect(screen.getByDisplayValue("3000")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: 234 } });
    expect(screen.getByDisplayValue("234")).toBeInTheDocument();
  });
});
