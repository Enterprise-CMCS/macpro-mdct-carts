import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render } from "@testing-library/react";

import UserRoleAssociations from "./UserRoleAssociations";
import { AppRoles } from "../../types";

const mockStore = configureMockStore();
const adminUserStore = mockStore({
  stateUser: { currentUser: { role: AppRoles.CMS_ADMIN } },
});
const unauthorizedUserStore = mockStore({
  stateUser: { currentUser: { role: "fake_user" } },
});

const TestUserRoleAssociationsAdminComponent = (
  <Provider store={adminUserStore}>
    <UserRoleAssociations />
  </Provider>
);

const TestUserRoleAssociationsUnauthorizedComponent = (
  <Provider store={unauthorizedUserStore}>
    <UserRoleAssociations />
  </Provider>
);

const authorizedTestText = "Upload file";
const unauthorizedTestText = "You do not have access to this functionality.";

describe("UserRoleAssociations Component", () => {
  it("renders correctly for authorized user", () => {
    render(TestUserRoleAssociationsAdminComponent);
    expect(screen.queryByText(authorizedTestText)).toBeInTheDocument();
    expect(screen.queryByText(unauthorizedTestText)).toBeNull();
  });

  it("renders correctly for unauthorized user", () => {
    render(TestUserRoleAssociationsUnauthorizedComponent);
    expect(screen.queryByText(authorizedTestText)).toBeNull();
    expect(screen.queryByText(unauthorizedTestText)).toBeInTheDocument();
  });
});
