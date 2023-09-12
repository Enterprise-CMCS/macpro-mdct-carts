import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen, render } from "@testing-library/react";

import StateAssociations from "./StateAssociations";
import { AppRoles } from "../../types";

const mockStore = configureMockStore();
const adminUserStore = mockStore({
  stateUser: { currentUser: { role: AppRoles.CMS_ADMIN } },
});
const unauthorizedUserStore = mockStore({
  stateUser: { currentUser: { role: "fake_user" } },
});

const TestStateAssociationsAdminComponent = (
  <Provider store={adminUserStore}>
    <StateAssociations />
  </Provider>
);

const TestStateAssociationsUnauthorizedComponent = (
  <Provider store={unauthorizedUserStore}>
    <StateAssociations />
  </Provider>
);

const authorizedTestText = "Upload file";
const unauthorizedTestText = "You do not have access to this functionality.";

describe("StateAssociations Component", () => {
  it("renders correctly for authorized user", () => {
    render(TestStateAssociationsAdminComponent);
    expect(screen.queryByText(authorizedTestText)).toBeInTheDocument();
    expect(screen.queryByText(unauthorizedTestText)).toBeNull();
  });

  it("renders correctly for unauthorized user", () => {
    render(TestStateAssociationsUnauthorizedComponent);
    expect(screen.queryByText(authorizedTestText)).toBeNull();
    expect(screen.queryByText(unauthorizedTestText)).toBeInTheDocument();
  });
});
