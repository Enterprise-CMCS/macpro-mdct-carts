import React from "react";
import { mount, shallow } from "enzyme";
import { axe } from "jest-axe";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Header from "./Header";

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    currentUser: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      role: "",
      state: {
        id: "",
      },
    },
  },
});

const header = (
  <Provider store={store}>
    <Header currentYear={2021} />
  </Provider>
);

describe("Header", () => {
  it("should render the Header Component correctly", () => {
    expect(shallow(header).exists()).toBe(true);
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const wrapper = mount(header);
    const results = await axe(wrapper.html());
    expect(results).toHaveNoViolations();
  });
});
