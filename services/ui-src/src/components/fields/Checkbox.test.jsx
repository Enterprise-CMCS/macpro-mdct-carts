import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";

describe("Checkbox component", () => {
  const baseProps = {
    onChange: jest.fn(),
    question: {
      label: "Favorite Fruits",
      answer: {
        entry: [],
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
        ],
      },
    },
    name: "fruits",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all checkbox options", () => {
    const { getByLabelText } = render(<Checkbox {...baseProps} />);
    expect(
      getByLabelText("Question: Favorite Fruits, Answer: Apple")
    ).toBeInTheDocument();
    expect(
      getByLabelText("Question: Favorite Fruits, Answer: Banana")
    ).toBeInTheDocument();
    expect(
      getByLabelText("Question: Favorite Fruits, Answer: Cherry")
    ).toBeInTheDocument();
  });

  it("checks the correct checkboxes based on value", () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: ["banana"],
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    expect(getByLabelText(/Apple/).checked).toBe(false);
    expect(getByLabelText(/Banana/).checked).toBe(true);
    expect(getByLabelText(/Cherry/).checked).toBe(false);
  });

  it("calls onChange with correct value when a checkbox is checked", () => {
    const { getByLabelText } = render(<Checkbox {...baseProps} />);
    const appleCheckbox = getByLabelText(/Apple/);
    fireEvent.click(appleCheckbox);
    expect(baseProps.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["apple"] },
    });
  });

  it("calls onChange with correct value when a checkbox is unchecked", () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: ["apple", "banana"],
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const bananaCheckbox = getByLabelText(/Banana/);
    fireEvent.click(bananaCheckbox);
    expect(props.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["apple"] },
    });
  });

  it("handles single string entry as value", () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: "cherry",
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    expect(getByLabelText(/Cherry/).checked).toBe(true);
  });

  it("renders with custom name prop", () => {
    const props = { ...baseProps, name: "customName" };
    const { getByLabelText } = render(<Checkbox {...props} />);
    expect(getByLabelText(/Apple/).name).toBe("customName");
  });

  it("renders nothing if options are empty", () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          options: [],
        },
      },
    };
    const { container } = render(<Checkbox {...props} />);
    expect(container.querySelectorAll("input[type='checkbox']").length).toBe(0);
  });
});

// We recommend installing an extension to run jest tests.
