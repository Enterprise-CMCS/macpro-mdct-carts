import React from "react";
import { shallow } from "enzyme";
import { act, render, fireEvent } from "@testing-library/react";
import { LocalLogins } from "./LocalLogins";

const mockPost = jest.fn();
const localLogins = <LocalLogins />;
jest.mock("aws-amplify", () => ({
  __esModule: true,
  Auth: {
    signIn: (email, password) => mockPost(email, password),
  },
}));
const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("LocalLogin component", () => {
  it("should render successfully", () => {
    expect(shallow(localLogins).exists()).toBe(true);
  });

  it("should attempt to login and nav the user on click", async () => {
    const { getByTestId } = render(localLogins);
    const generateButton = getByTestId("login-button");
    const emailField = getByTestId("login-email");
    const passwordField = getByTestId("login-password");

    await act(async () => {
      fireEvent.change(emailField, { target: { value: "myEmail@email.com" } });
    });
    await act(async () => {
      fireEvent.change(passwordField, { target: { value: "superS3cure" } });
    });
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(mockPost).toHaveBeenCalledWith("myEmail@email.com", "superS3cure");
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
  });
});
