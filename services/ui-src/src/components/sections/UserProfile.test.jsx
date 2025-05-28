import React from "react";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserProfile from "./UserProfile";
import { render, screen } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      role: "",
      state: {
        id: "",
      },
    },
  },
});

const userProfile = (
  <Provider store={store}>
    <UserProfile />
  </Provider>
);

describe("UserProfile", () => {
  it("should render the UserProfile Component correctly", () => {
    render(userProfile);
    expect(screen.getByRole("heading", { name: "User Profile" })).toBeVisible();
  });
});

describe("Test UserProfile accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(userProfile);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
