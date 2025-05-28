import React from "react";
import Home from "./Home";
import { AppRoles } from "../../types";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { render, screen } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({});

jest.mock("./HomeAdmin", () => () => {
  return <p>home-admin</p>;
});
jest.mock("./HomeCMS", () => () => {
  return <p>home-cms</p>;
});
jest.mock("./HomeState", () => () => {
  return <p>home-state</p>;
});
jest.mock("./Unauthorized", () => () => {
  return <p>unauthorized</p>;
});

describe("Home Component", () => {
  it.each([
    [AppRoles.CMS_USER, "home-cms"],
    [AppRoles.CMS_ADMIN, "home-admin"],
    [AppRoles.INTERNAL_USER, "home-cms"],
    [AppRoles.HELP_DESK, "home-cms"],
    [AppRoles.CMS_APPROVER, "home-cms"],
    [AppRoles.STATE_USER, "home-state"],
    ["", "unauthorized"],
  ])("User role %s should see the matching homepage)", (role, expected) => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Home role={role} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(expected)).toBeVisible();
  });
});
