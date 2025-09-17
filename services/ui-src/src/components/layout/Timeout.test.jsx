import React from "react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
// components
import Timeout from "./Timeout";
// utils
import { PROMPT_AT } from "../../hooks/authHooks";
import { mockInitialState } from "../../util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);

const mockLogout = jest.fn();
jest.mock("../../hooks/authHooks", () => ({
  ...jest.requireActual("../../hooks/authHooks"),
  useUser: jest.fn(() => ({
    logout: mockLogout,
  })),
}));

window.scrollTo = jest.fn();

const TimeoutComponent = () => (
  <Provider store={store}>
    <MemoryRouter>
      <Timeout />
    </MemoryRouter>
  </Provider>
);

describe("Timeout component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(<TimeoutComponent />);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  test("renders nothing when timeout active", () => {
    expect(
      screen.queryByRole("heading", { name: "You are about to be logged out." })
    ).not.toBeInTheDocument();
  });
  test("renders when prompt timer runs out", () => {
    act(() => {
      jest.advanceTimersByTime(PROMPT_AT + 50);
    });
    expect(
      screen.getByRole("heading", { name: "You are about to be logged out." })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Stay Logged In" })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  test("resets timer and closes dialog when Stay Logged In selected", async () => {
    act(() => {
      jest.advanceTimersByTime(PROMPT_AT + 50);
    });
    expect(
      screen.getByRole("heading", { name: "You are about to be logged out." })
    ).toBeVisible();
    const stayLoggedInButton = screen.getByRole("button", {
      name: "Stay Logged In",
    });
    expect(stayLoggedInButton).toBeVisible();
    await act(async () => {
      await stayLoggedInButton.click();
      jest.advanceTimersByTime(PROMPT_AT + 50);
    });
    expect(
      screen.queryByRole("heading", { name: "You are about to be logged out." })
    ).not.toBeInTheDocument();
  });

  test("logs user out when log out is selected", async () => {
    act(() => {
      jest.advanceTimersByTime(PROMPT_AT + 50);
    });
    expect(
      screen.getByRole("heading", { name: "You are about to be logged out." })
    ).toBeVisible();
    const logoutButton = screen.getByRole("button", { name: "Log out" });
    expect(logoutButton).toBeVisible();
    await act(async () => {
      await logoutButton.click();
      jest.advanceTimersByTime(PROMPT_AT + 50);
    });
    expect(mockLogout).toHaveBeenCalled();
  });
});
