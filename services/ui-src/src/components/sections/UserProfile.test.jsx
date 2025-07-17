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
      email: "test.user@example.com",
      username: "testuser123",
      firstname: "Test",
      lastname: "User",
      role: "State User",
      state: {
        id: "AL",
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

  test("should render description terms and values", () => {
    render(userProfile);
    const euaIdTerm = screen.getByText("EUA Id:");
    expect(euaIdTerm.tagName).toBe("DT");
    const euaIdValue = screen.getByText("testuser123");
    expect(euaIdValue.tagName).toBe("DD");

    const nameTerm = screen.getByText("Name:");
    expect(nameTerm.tagName).toBe("DT");
    const nameValue = screen.getByText("Test User");
    expect(nameValue.tagName).toBe("DD");

    const emailTerm = screen.getByText("Email:");
    expect(emailTerm.tagName).toBe("DT");
    const emailValue = screen.getByText("test.user@example.com");
    expect(emailValue.tagName).toBe("DD");

    const roleTerm = screen.getByText("Role:");
    expect(roleTerm.tagName).toBe("DT");
    const roleValue = screen.getByText("State User");
    expect(roleValue.tagName).toBe("DD");
  });

  testA11y(userProfile);
});
