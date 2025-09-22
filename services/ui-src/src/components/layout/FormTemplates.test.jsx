import React from "react";
import { act, render, fireEvent } from "@testing-library/react";
import FormTemplates from "./FormTemplates";
import { apiLib } from "../../util/apiLib";

jest.mock("../../hooks/authHooks");
window.alert = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedUsedNavigate,
}));

const formTemplate = <FormTemplates />;
describe("<FormTemplates />", () => {
  beforeEach(() => {
    window.alert.mockClear();
  });

  test("fires the generate forms event on button click, then navigates", async () => {
    const apiSpy = jest.spyOn(apiLib, "post");
    const { getByTestId } = render(formTemplate);
    const generateButton = getByTestId("generate-forms-button");
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(apiSpy).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });
});
