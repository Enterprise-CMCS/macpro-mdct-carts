import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import StateHeader from "./StateHeader";
import {
  adminUserWithReportInProgress,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const mockStore = configureMockStore();
const stateUserStore = mockStore(stateUserWithReportInProgress);
const adminUserStore = mockStore(adminUserWithReportInProgress);

describe("State Header Component", () => {
  test("should render correctly", () => {
    const header = (
      <Provider store={stateUserStore}>
        <StateHeader />
      </Provider>
    );
    expect(shallow(header).exists()).toBe(true);
  });

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
