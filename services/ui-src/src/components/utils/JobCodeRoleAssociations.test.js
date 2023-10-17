import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render } from "@testing-library/react";

import JobCodeRoleAssociations from "./JobCodeRoleAssociations";
import { AppRoles } from "../../types";

const mockStore = configureMockStore();
const adminUserStore = mockStore({
  stateUser: { currentUser: { role: AppRoles.CMS_ADMIN } },
});
const unauthorizedUserStore = mockStore({
  stateUser: { currentUser: { role: "fake_user" } },
});

const TestJobCodeRoleAssociationsAdminComponent = (
  <Provider store={adminUserStore}>
    <JobCodeRoleAssociations />
  </Provider>
);

const TestJobCodeRoleAssociationsUnauthorizedComponent = (
  <Provider store={unauthorizedUserStore}>
    <JobCodeRoleAssociations />
  </Provider>
);

const authorizedTestText = "Upload file";
const unauthorizedTestText = "You do not have access to this functionality.";

describe("JobCodeRoleAssociations Component", () => {
  it("renders correctly for authorized user", () => {
    render(TestJobCodeRoleAssociationsAdminComponent);
    expect(screen.queryByText(authorizedTestText)).toBeInTheDocument();
    expect(screen.queryByText(unauthorizedTestText)).toBeNull();
  });

  it("renders correctly for unauthorized user", () => {
    render(TestJobCodeRoleAssociationsUnauthorizedComponent);
    expect(screen.queryByText(authorizedTestText)).toBeNull();
    expect(screen.queryByText(unauthorizedTestText)).toBeInTheDocument();
  });
});
