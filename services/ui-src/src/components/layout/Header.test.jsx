import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import {
  adminUserWithReportInProgress,
  stateUserNoUsername,
  stateUserSimple,
  stateUserWithReportCertified,
  stateUserWithReportInProgress,
} from "../../store/fakeStoreExamples";
import { testA11y } from "../../util/testing/testUtils";

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

describe("<Header />", () => {
  test("should have a usaBanner as a child component", () => {
    render(header);
    expect(
      screen.getByText("An official website of the United States government")
    ).toBeVisible();
  });
  test("should not show the autosave component by default ", () => {
    render(header);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  test("should not show the autosave when user is an admin", () => {
    render(headerOnReportPageAsAdminUser);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  test("should not show the autosave when user is an state user on a report thats certified", () => {
    render(headerOnReportPageAsStateUserThatsCertified);
    expect(screen.queryByTestId("autosave")).not.toBeInTheDocument();
  });
  test("should show autosave component only when user is a state user, is on a report page, and status is in progress", () => {
    render(headerOnReportPageAsStateUserThatsInProgress);
    expect(screen.queryByTestId("autosave")).toBeInTheDocument();
  });
  test("should render the dropdownmenu if user is logged in", () => {
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
  test("should render the dropdownmenu in a closed initial state with a chevron pointed down", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    const chevDown = screen.getByTestId("headerDropDownChevDown");
    expect(headerDropDownMenuButton).toContainElement(chevDown);
  });

  test("should render the dropdownmenu on click with a chevron pointed up and items underneath", () => {
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
    expect(
      screen.getByRole("menuitem", { name: "Manage Account" })
    ).toBeVisible();
  });

  test("should open and close the dropdown menu on click", () => {
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

  test("should have correct ARIA attributes on the menu button", () => {
    render(header);
    const menuButton = screen.getByTestId("headerDropDownMenuButton");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveAttribute("aria-haspopup", "true");
    expect(menuButton).toHaveAttribute("aria-controls", "header-menu");
  });

  test("should have correct ARIA attributes on the menu", () => {
    render(header);
    const menuButton = screen.getByTestId("headerDropDownMenuButton");
    fireEvent.click(menuButton);
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("id", "header-menu");
  });

  test("should have no role on list items and role=menuitem on links", () => {
    const { container } = render(header);
    const menuButton = screen.getByTestId("headerDropDownMenuButton");
    fireEvent.click(menuButton);
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(2);
    const listItems = container.querySelectorAll("li");
    listItems.forEach((item) => {
      expect(item).not.toHaveAttribute("role");
    });
  });

  test("should close menu and return focus to button on ESC key", () => {
    render(header);
    const menuButton = screen.getByTestId("headerDropDownMenuButton");
    fireEvent.click(menuButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });

  test("should close menu when clicking outside", () => {
    const { container } = render(header);
    const menuButton = screen.getByTestId("headerDropDownMenuButton");
    fireEvent.click(menuButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(container);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  testA11y(header);
});
