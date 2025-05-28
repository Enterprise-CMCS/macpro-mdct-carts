import React, { useState } from "react";
import { Provider } from "react-redux";
import { screen, render } from "@testing-library/react";
import userEventLib from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";

import Text from "./Text";

jest.mock("../utils/helperFunctions", () => ({
  generateQuestionNumber: jest.fn((id) => `generated-id-for-${id}`),
}));

const mockStore = configureMockStore();
const store = mockStore({
  formData: [
    {
      contents: {
        section: {
          year: 2023,
          state: "AL",
        },
      },
    },
  ],
  lastYearFormData: [
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
                      id: "2022-03-c-05-09",
                      answer: {
                        entry: "wow cool",
                      },
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
});

/*
 * <Text> expects to be contained within a component that receives value
 * updates via an onChange handler, and sends them back via answer.entry.
 * So we create this harness component to test <Text> in isolation.
 */
const TextComponentWithProps = (testSpecificProps) => {
  const defaultProps = {
    question: {
      id: "mock-question-id",
      label: "mock-label",
    },
  };

  const combinedProps = {
    ...defaultProps,
    ...testSpecificProps,
  };

  if (combinedProps.value !== undefined)
    throw new Error("Get that value outta here");

  const [val, setVal] = useState(combinedProps.question);
  const changeHandler = (evt) => {
    setVal({
      ...val,
      answer: {
        ...val.answer,
        entry: evt.target.value,
      },
    });
  };

  return (
    <Provider store={store}>
      <Text {...combinedProps} onChange={changeHandler} question={val} />
    </Provider>
  );
};

describe("<Text />", () => {
  test("should render an input with appropriate attributes", () => {
    render(<TextComponentWithProps />);

    const expectedLabelText = "generated-id-for-mock-question-id mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("aria-label", "mock-label");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  test("should include question hint if given", () => {
    const props = {
      question: {
        id: "mock-question-id",
        label: "mock-label",
        hint: "mock-hint",
      },
    };
    render(<TextComponentWithProps {...props} />);

    const expectedLabelText = "generated-id-for-mock-question-id mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    expect(screen.getByText("mock-hint")).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("aria-label", "mock-label mock-hint");
  });

  test("should render the current value if provided", () => {
    const props = {
      question: {
        id: "mock-question-id",
        label: "mock-label",
        answer: {
          entry: "foo",
        },
      },
    };
    render(<TextComponentWithProps {...props} />);

    const expectedLabelText = "generated-id-for-mock-question-id mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    expect(inputElement.value).toBe("foo");
  });

  test("should disable the input if instructed", () => {
    render(<TextComponentWithProps disabled={true} />);

    const expectedLabelText = "generated-id-for-mock-question-id mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    expect(inputElement).toBeDisabled();
  });

  test("should fetch data from the previous year for 20xx-03-c-05-09", () => {
    const props = {
      question: {
        id: "2023-03-c-05-09",
        label: "mock-label",
      },
    };
    render(<TextComponentWithProps {...props} />);

    const expectedLabelText = "generated-id-for-2023-03-c-05-09 mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    expect(inputElement.value).toBe("wow cool");
  });

  test("should transmit its values through onChange events", async () => {
    render(<TextComponentWithProps />);

    const expectedLabelText = "generated-id-for-mock-question-id mock-label";
    const inputElement = screen.getByLabelText(expectedLabelText);
    await userEventLib.type(inputElement, "foo");

    expect(inputElement.value).toBe("foo");
  });
});
