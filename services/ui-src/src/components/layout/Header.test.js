import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import Autosave from "./Autosave";

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
    <Header />
  </Provider>
);

const headerWithAutosave = (
  <Provider store={store}>
    <Header showAutoSave />
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
    const wrapper = mount(header);
    const results = wrapper.find({ "data-testid": "cartsCurrentYear" }).html();
    expect(results.includes(2077)).toBeTruthy();
  });
  it("should not show the autosave component by default ", () => {
    const wrapper = mount(header);
    expect(wrapper.containsMatchingElement(<Autosave />)).toEqual(false);
  });
  it("should show the autosave component when prop passed is true", () => {
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
