import React from "react";
import { render } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import LocalLogins from "./LocalLogins";
import userReducer from "../../store/reducers/userReducer";
import { BrowserRouter as Router } from "react-router-dom";

function renderWithProviders(ui, { reduxState } = {}) {
  const store = createStore(userReducer, reduxState || {});
  return render(<Provider store={store}>{ui}</Provider>);
}

describe("static local login button list", () => {
  it("display local login link for different roles", async () => {
    const result = renderWithProviders(
      <Router>
        <LocalLogins />
      </Router>,
      {
        reduxState: {
          user: {
            username: "alice",
            attributes: {
              given_name: "Alice",
              family_name: "Foo",
              email: "alice@example.com",
              "custom:cms_roles": "APPROVER",
            },
          },
        },
      }
    );

    const adminLogin = result.getByText("Login as an Admin");
    const stateUserLogin = result.getByText("Login as a State user");
    const boLogin = result.getByText("Login as a BO");
    expect(adminLogin).toBeVisible();
    expect(stateUserLogin).toBeVisible();
    expect(boLogin).toBeVisible();
  });
});
