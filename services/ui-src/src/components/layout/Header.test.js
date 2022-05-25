import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import Autosave from "./Autosave";
import { MemoryRouter } from "react-router";
import { screen, render } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore({
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

const header = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  </Provider>
);

const headerWithAutosave = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/views/sections/"]}>
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
  it("should show autosave component when on a report", () => {
    const wrapper = mount(headerWithAutosave);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(true);
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(header);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
