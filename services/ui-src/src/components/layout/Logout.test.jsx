import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Logout from "./Logout";

const logoutComponent = <Logout />;

const mockLogout = jest.fn();
jest.mock("../../hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    logout: mockLogout,
  })),
}));

describe("<Logout />", () => {
  test("triggers logout on click event", () => {
    const { getByTestId } = render(logoutComponent);
    fireEvent.click(getByTestId("logout"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
