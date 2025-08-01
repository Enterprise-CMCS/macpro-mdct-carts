import React from "react";
import { act, render, fireEvent, screen } from "@testing-library/react";
import { LocalLogins } from "./LocalLogins";

const localLogins = <LocalLogins />;
const mockLoginUser = jest.fn();
jest.mock("../../../util/apiLib", () => ({
  loginUser: (username, password) => mockLoginUser(username, password),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("<LocalLogin />", () => {
  test("should attempt to login and nav the user on click", async () => {
    const { getByTestId } = render(localLogins);
    const generateButton = getByTestId("login-button");
    const emailField = getByTestId("login-email");
    const passwordField = getByTestId("login-password");

    await act(async () => {
      fireEvent.change(emailField, { target: { value: "myEmail@email.com" } });
    });
    await act(async () => {
      fireEvent.change(passwordField, { target: { value: "test" } });
    });
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(mockLoginUser).toHaveBeenCalledWith("myEmail@email.com", "test");
  });

  test("should display alert notification if there is an error on login", async () => {
    mockLoginUser.mockRejectedValue(new Error("Invalid credentials"));

    const { getByTestId } = render(localLogins);
    const generateButton = getByTestId("login-button");
    const emailField = getByTestId("login-email");
    const passwordField = getByTestId("login-password");

    await act(async () => {
      fireEvent.change(emailField, { target: { value: "wrong@email.com" } });
    });
    await act(async () => {
      fireEvent.change(passwordField, { target: { value: "wrong" } });
    });
    await act(async () => {
      fireEvent.click(generateButton);
    });
    expect(mockLoginUser).toHaveBeenCalledWith("wrong@email.com", "wrong");
    const alert = await screen.findByRole("heading", {
      name: /there was an issue logging in/i,
    });
    expect(alert).toBeInTheDocument();
  });
});
