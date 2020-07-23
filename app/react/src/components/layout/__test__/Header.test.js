import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

import configureMockStore from "redux-mock-store";

import Header from "../Header";

const mockStore = configureMockStore();

describe("Header Component, enzyme testing", () => {
  const store = mockStore({
    stateUser: {
      currentUser: {
        role: "admin",
        state: { id: "NY", name: "New York" },
        username: "karen.dalton@state.gov",
      },
    },
  });

  const wrapper = mount(
    <Provider store={store}>
      <Header />
    </Provider>
  );
  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders with header classname", () => {
    expect(wrapper.exists(".header")).toBe(true);
  });
});

describe("Header Component, snapshot testing", () => {
  const store = mockStore({
    stateUser: {
      currentUser: {
        role: "admin",
        state: { id: "NY", name: "New York" },
        username: "karen.dalton@state.gov",
      },
    },
  });

  const snapShot = renderer.create(
    <Provider store={store}>
      <Header />
    </Provider>
  );

  it("should render with given state from Redux store", () => {
    expect(snapShot.toJSON()).toMatchSnapshot();
  });
});
