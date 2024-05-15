import React from "react";
import { shallow } from "enzyme";
import FillForm from "./FillForm";
import { render, fireEvent } from "@testing-library/react";

const mockEvent = jest.fn();
const form = (
  <FillForm onClick={mockEvent} name="formName" title="link title" />
);

describe("Fill Form Component", () => {
  it("should render correctly", () => {
    expect(shallow(form).exists()).toBe(true);
  });

  it("triggers the provided click behavior onClick", () => {
    const { getByTestId } = render(form);
    fireEvent.click(getByTestId("form-action"));
    expect(mockEvent).toBeCalled();
  });
});
