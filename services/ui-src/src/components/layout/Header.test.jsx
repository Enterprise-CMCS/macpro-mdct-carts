import React from "react";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import {
  adminUserWithReportInProgress,
  stateUserNoUsername,
  stateUserSimple,
  stateUserWithReportCertified,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";

const mockStore = configureMockStore();
const store = mockStore(stateUserSimple);

const noUserNameStore = mockStore(stateUserNoUsername);

const stateUserWithReportInProgressStore = mockStore(
  stateUserWithReportInProgress
);

const stateUserWithReportCertifiedStore = mockStore(
  stateUserWithReportCertified
);

const adminUserWithReportStore = mockStore(adminUserWithReportInProgress);

const header = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerWithNoUsername = (
  <Provider store={noUserNameStore}>
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsStateUserThatsInProgress = (
  <Provider store={stateUserWithReportInProgressStore}>
    <MemoryRouter initialEntries={["/sections/2021/00"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsStateUserThatsCertified = (
  <Provider store={stateUserWithReportCertifiedStore}>
    <MemoryRouter initialEntries={["/sections/2021/00"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerOnReportPageAsAdminUser = (
  <Provider store={adminUserWithReportStore}>
    <MemoryRouter initialEntries={["views/sections/AL/2021/00/a"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

describe("Test Header", () => {
  it("should have a usaBanner as a child component", () => {
    render(header);
    expect(
      screen.getByText("An official website of the United States government")
    ).toBeVisible();
  });
  it("should not show the autosave component by default ", () => {
    render(header);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  it("should not show the autosave when user is an admin", () => {
    render(headerOnReportPageAsAdminUser);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  it("should not show the autosave when user is an state user on a report thats certified", () => {
    render(headerOnReportPageAsStateUserThatsCertified);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  it("should show autosave component only when user is a state user, is on a report page, and status is in progress", () => {
    render(headerOnReportPageAsStateUserThatsInProgress);
    expect(screen.queryByTestId("autosave")).toBeInTheDocument();
  });
  it("should render the dropdownmenu if user is logged in", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    expect(headerDropDownMenuButton).toHaveTextContent("My Account");
  });
  // TODO: it does render the menu because it just checks for any `currentUser` object. need to modify Header code to fix.
  it.skip("should not render the dropdownmenu if user is not logged in", () => {
    render(headerWithNoUsername);
    expect(screen.queryByTestId("headerDropDownMenu")).not.toBeInTheDocument();
  });
  it("should render the dropdownmenu in a closed initial state with a chevron pointed down", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    const chevDown = screen.getByTestId("headerDropDownChevDown");
    expect(headerDropDownMenuButton).toContainElement(chevDown);
  });

  it("should render the dropdownmenu on click with a chevron pointed up and items underneath", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    fireEvent.click(headerDropDownMenuButton);
    const chevUp = screen.getByTestId("headerDropDownChevUp");
    const headerDropDownMenu = screen.getByTestId("headerDropDownMenu");
    const headerDropDownLinks = screen.getByTestId("headerDropDownLinks");
    expect(headerDropDownMenuButton).toContainElement(chevUp);
    expect(headerDropDownMenu).toContainElement(headerDropDownLinks);
  });

  it("should open and close the dropdown menu on click", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    fireEvent.click(headerDropDownMenuButton);
    const chevUp = screen.getByTestId("headerDropDownChevUp");
    expect(headerDropDownMenuButton).toContainElement(chevUp);
    fireEvent.click(headerDropDownMenuButton);
    const chevDown = screen.getByTestId("headerDropDownChevDown");
    expect(headerDropDownMenuButton).toContainElement(chevDown);
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(header);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
