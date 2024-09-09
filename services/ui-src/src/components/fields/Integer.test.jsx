import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { shallow, mount } from "enzyme";
import Integer from "./Integer";
import { screen, render, fireEvent } from "@testing-library/react";

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
  it("should render correctly", () => {
    const props = { question: { id: "2023-00-a-01-01", answer: 1 } };
    expect(shallow(buildInteger(props)).exists()).toBe(true);
  });

  it("should render Previous Year data correctly", () => {
    const props = { question: { id: "2023-00-a-01-01", answer: { entry: 0 } } };
    expect(mount(buildInteger(props)).exists()).toBe(true);
  });

  it("should render an Integer", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "How many lightbulbs does it take to change a man?",
        answer: { entry: 123 },
      },
    };
    render(buildInteger(props));
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();

    props.question.answer.entry = 0;
    render(buildInteger(props));
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
  });

  it("should update new numbers", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "How many lightbulbs does it take to change a man?",
        answer: { entry: 123 },
      },
    };

    render(buildInteger(props));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: 234 } });
    expect(screen.getByDisplayValue("234")).toBeInTheDocument();
  });

  it("should filter out non-numbers", () => {
    const props = {
      question: {
        id: "2023-00-a-01-01",
        label: "How many lightbulbs does it take to change a man?",
        answer: { entry: "hope" },
      },
    };

    render(buildInteger(props));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "raw text" } });
    expect(screen.queryByDisplayValue("raw text")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should render previous year value for appropriate 3c part 5 or 6 questions", () => {
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
