import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";
import { describe } from "yargs";

const mockStore = configureMockStore();
const testYear = 525600;
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
    currentYear: testYear,
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

describe("Header", () => {
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
    expect(results.includes(testYear)).toBeTruthy();
  });
});

describe("Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(header);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
