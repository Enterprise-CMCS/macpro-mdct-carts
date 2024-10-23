import React from "react";
import { shallow } from "enzyme";
import FormTemplates from "./FormTemplates";
import { act, render, fireEvent } from "@testing-library/react";

const mockAmplifyApi = require("aws-amplify/api");

jest.mock("../../hooks/authHooks");
window.alert = jest.fn();

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const formTemplate = <FormTemplates />;
describe("FormTemplates Component", () => {
  beforeEach(() => {
    window.alert.mockClear();
  });

  it("should render correctly", () => {
    expect(shallow(formTemplate).exists()).toBe(true);
  });

  it("fires the generate forms event on button click, then navigates", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    const { getByTestId } = render(formTemplate);
    const generateButton = getByTestId("generate-forms-button");
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(apiSpy).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
