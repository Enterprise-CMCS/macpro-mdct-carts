import React from "react";
import { render } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import StateHeader from "./StateHeader";
import {
  adminUserWithReportInProgress,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const mockStore = configureMockStore();
const stateUserStore = mockStore(stateUserWithReportInProgress);
const adminUserStore = mockStore(adminUserWithReportInProgress);

describe("<StateHeader />", () => {
  test("Displays state header content for state user", () => {
    const header = (
      <Provider store={stateUserStore}>
        <StateHeader />
      </Provider>
    );
    const { getByTestId, getByAltText } = render(header);
    const headerComponent = getByTestId("state-header");
    expect(headerComponent).toHaveTextContent("Alabama");
    const img = getByAltText("Alabama");
    expect(img.src).toContain("al.svg");
  });

  test("Does not display state header content for admin user", () => {
    const header = (
      <Provider store={adminUserStore}>
        <StateHeader />
      </Provider>
    );
    const { queryByTestId } = render(header);
    expect(queryByTestId("state-header")).not.toBeInTheDocument();
  });
});
