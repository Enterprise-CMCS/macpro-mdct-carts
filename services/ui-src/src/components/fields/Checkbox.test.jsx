import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";
import userEvent from "@testing-library/user-event";

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

  test("renders all checkbox options", () => {
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

  test("checks the correct checkboxes based on value", () => {
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

  test("calls onChange with correct value when a checkbox is checked", () => {
    const { getByLabelText } = render(<Checkbox {...baseProps} />);
    const appleCheckbox = getByLabelText(/Apple/);
    fireEvent.click(appleCheckbox);
    expect(baseProps.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["apple"] },
    });
  });

  test("calls onChange with correct value when a checkbox is unchecked", () => {
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

  test("returns empty array when unchecking the last checked item", async () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: ["apple"],
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const appleCheckbox = getByLabelText(/Apple/);
    await userEvent.click(appleCheckbox);
    expect(props.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: [] },
    });
  });

  test("handles null entry by creating a clean array on check", async () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: null,
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const appleCheckbox = getByLabelText(/Apple/);
    await userEvent.click(appleCheckbox);
    expect(props.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["apple"] },
    });
  });

  test("handles undefined entry by creating a clean array on check", async () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: undefined,
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const bananaCheckbox = getByLabelText(/Banana/);
    await userEvent.click(bananaCheckbox);
    expect(props.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["banana"] },
    });
  });

  test("filters out null values from an existing array entry", async () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          entry: [null],
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const appleCheckbox = getByLabelText(/Apple/);
    await userEvent.click(appleCheckbox);
    expect(props.onChange).toHaveBeenCalledWith({
      target: { name: "fruits", value: ["apple"] },
    });
  });

  test("handles single string entry as value", () => {
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

  test("renders with custom name prop", () => {
    const props = { ...baseProps, name: "customName" };
    const { getByLabelText } = render(<Checkbox {...props} />);
    expect(getByLabelText(/Apple/).name).toBe("customName");
  });

  test("renders nothing if options are empty", () => {
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

  test("sanitizes whitespace out of the input id and keeps the label associated", () => {
    const props = {
      ...baseProps,
      question: {
        ...baseProps.question,
        answer: {
          ...baseProps.question.answer,
          options: [
            { label: "Strawberry", value: "strawberry" },
          ],
        },
      },
    };
    const { getByLabelText } = render(<Checkbox {...props} />);
    const input = getByLabelText(
      "Question: Favorite Fruits, Answer: Strawberry"
    );
    expect(input.id).toBe("fruits-strawberry");
    expect(input.id).not.toMatch(/\s/);
    const label = document.querySelector(`label[for="${input.id}"]`);
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe("Strawberry");
  });
});
