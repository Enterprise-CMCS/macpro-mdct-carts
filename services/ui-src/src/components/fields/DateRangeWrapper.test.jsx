import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DateRangeWrapper } from "./DateRangeWrapper";

// Mock DateRange component
jest.mock("../layout/DateRange", () => {
  return ({ onChange }) => (
    <button
      data-testid="date-range"
      onClick={() => onChange(["test-question-id", "2024-01-01 to 2024-01-31"])}
    >
      Mock DateRange
    </button>
  );
});

describe("DateRangeWrapper", () => {
  const question = { id: "test-question-id", text: "Test Question" };
  const onChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders DateRange with correct props", () => {
    const { getByTestId } = render(
      <DateRangeWrapper
        onChange={onChange}
        question={question}
        extraProp="foo"
      />
    );
    const button = getByTestId("date-range");
    expect(button).toBeInTheDocument();
  });

  it("calls onChange with correct event shape when DateRange triggers change", () => {
    const { getByTestId } = render(
      <DateRangeWrapper onChange={onChange} question={question} />
    );
    fireEvent.click(getByTestId("date-range"));
    expect(onChange).toHaveBeenCalledWith({
      target: { name: "test-question-id", value: "2024-01-01 to 2024-01-31" },
    });
  });
});
