import React from "react";
import { shallow } from "enzyme";
import FormTemplates from "./FormTemplates";
import { act, render, fireEvent } from "@testing-library/react";

const mockPost = jest.fn();
jest.mock("aws-amplify", () => ({
  API: {
    post: () => mockPost(),
  },
}));
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
    const { getByTestId } = render(formTemplate);
    const generateButton = getByTestId("generate-forms-button");
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(mockPost).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
