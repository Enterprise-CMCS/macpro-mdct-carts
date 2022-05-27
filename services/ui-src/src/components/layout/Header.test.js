import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import Autosave from "./Autosave";
import { MemoryRouter } from "react-router";
import { screen, render, fireEvent } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: {
      email: "garthVader@DeathStarInc.com",
      username: "garthVader",
      firstname: "Garth",
      lastname: "Vader",
      role: "",
      state: {
        id: "",
      },
    },
  },
  global: {
    currentYear: 2077,
  },
  save: {
    error: false,
    saving: false,
  },
});

const noUserNameStore = mockStore({
  stateUser: {
    currentUser: {
      email: "garthVader@DeathStarInc.com",
      username: "",
      firstname: "",
      lastname: "",
      role: "",
      state: {
        id: "",
      },
    },
  },
  global: {
    currentYear: 2077,
  },
  save: {
    error: false,
    saving: false,
  },
});

const stateUserWithReportInProgressStore = mockStore({
  stateUser: {
    name: "Alabama",
    abbr: "AL",
    imageURI: "/img/states/al.svg",
    currentUser: {
      username: "stateuser2@test.com",
      state: {
        id: "AL",
      },
      role: "mdctcarts-state-user",
      lastname: "States",
      firstname: "Frank",
      email: "stateuser2@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/sections/2021/00",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
});

const stateUserWithReportCertifiedStore = mockStore({
  stateUser: {
    name: "Alabama",
    abbr: "AL",
    imageURI: "/img/states/al.svg",
    currentUser: {
      username: "stateuser2@test.com",
      state: {
        id: "AL",
      },
      role: "mdctcarts-state-user",
      lastname: "States",
      firstname: "Frank",
      email: "stateuser2@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/sections/2021/00",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "certified",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
});

const adminUserWithReportStore = mockStore({
  stateUser: {
    name: null,
    abbr: null,
    imageURI: null,
    currentUser: {
      username: "adminuser@test.com",
      state: {},
      role: "mdctcarts-approver",
      lastname: "Admins",
      firstname: "Adam",
      email: "adminuser@test.com",
    },
    localLogin: false,
  },
  global: {
    formName: "CARTS FY",
    largeTextBoxHeight: 6,
    isFetching: false,
    url: "/",
    queryParams: "",
    currentYear: 2021,
    formYear: 2021,
    stateName: "Alabama",
  },
  reportStatus: {
    AL2021: {
      status: "in_progress",
      year: 2021,
      stateCode: "AL",
      lastChanged: "2021-01-04 18:28:18.524133+00",
      username: "al@test.com",
      programType: "combo",
    },
  },
  save: {
    error: false,
    saving: false,
  },
});

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
  it("should render the Header Component correctly", () => {
    expect(shallow(header).exists()).toBe(true);
  });
  it("should have a usaBanner as a child component", () => {
    const wrapper = mount(header);
    expect(wrapper.find({ "data-testid": "usaBanner" }).length).toBe(1);
  });
  it("should have the current year reporting year in the header", () => {
    render(header);
    const currentYearElement = screen.getByTestId("cartsCurrentYear");
    expect(currentYearElement).toHaveTextContent(2077);
  });
  it("should not show the autosave component by default ", () => {
    const wrapper = mount(header);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should not show the autosave when user is an admin", () => {
    const wrapper = mount(headerOnReportPageAsAdminUser);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should not show the autosave when user is an state user on a report thats certified", () => {
    const wrapper = mount(headerOnReportPageAsStateUserThatsCertified);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should show autosave component only when user is a state user, is on a report page, and status is in progress", () => {
    const wrapper = mount(headerOnReportPageAsStateUserThatsInProgress);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(true);
  });
  it("should render the dropdownmenu if user is logged in", () => {
    render(header);
    const headerDropDownMenuButton = screen.getByTestId(
      "headerDropDownMenuButton"
    );
    expect(headerDropDownMenuButton).toHaveTextContent(
      "garthVader@DeathStarInc.com"
    );
  });
  it("should not render the dropdownmenu if user is not logged in", () => {
    render(headerWithNoUsername);
    const userDetailsRow = screen.getByTestId("userDetailsRow");
    expect(userDetailsRow).toBeEmpty();
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
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(header);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
