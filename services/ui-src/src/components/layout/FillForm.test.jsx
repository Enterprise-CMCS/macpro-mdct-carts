import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FillForm from "./FillForm";

const mockEvent = jest.fn();
const form = (
  <FillForm onClick={mockEvent} name="formName" title="link title" />
);

describe("<FillForm />", () => {
  test("triggers the provided click behavior onClick", async () => {
    render(form);
    const button = screen.getByTestId("form-action");
    await userEvent.click(button);
    expect(mockEvent).toHaveBeenCalled();
  });
});
