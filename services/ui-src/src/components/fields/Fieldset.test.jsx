import React from "react";
import { render, screen } from "@testing-library/react";
import { Fieldset } from "./Fieldset";

jest.mock("./DataGrid", () => () => <div data-testid="datagrid" />);

jest.mock("./SynthesizedTable", () => () => (
  <div data-testid="synthesized_table" />
));

jest.mock("./SynthesizedValue", () => () => (
  <div data-testid="synthesized_value" />
));

jest.mock("./NoninteractiveTable", () => {
  return {
    NoninteractiveTable: () => <div data-testid="noninteractive_table" />,
  };
});

describe("Fieldset component", () => {
  test.each([
    "datagrid",
    "synthesized_table",
    "synthesized_value",
    "noninteractive_table",
  ])("renders $fieldset_type", (fieldset_type) => {
    const question = {
      fieldset_type,
    };
    render(<Fieldset question={question} />);
    expect(screen.getByTestId(fieldset_type)).toBeInTheDocument();
  });
});
