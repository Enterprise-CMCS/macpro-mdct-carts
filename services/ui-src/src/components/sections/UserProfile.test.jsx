import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import UserProfile from "./UserProfile";
import { testA11y } from "../../util/testing/testUtils";

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

describe("<UserProfile />", () => {
  test("should render the UserProfile Component correctly", () => {
    render(userProfile);
    expect(screen.getByRole("heading", { name: "User Profile" })).toBeVisible();
  });

  testA11y(userProfile);
});
