import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount, ShallowWrapper } from "enzyme";

import configureMockStore from "redux-mock-store";

import Header from "../Header";

/**
 * Factory functon to create a ShallowWrapper for the Header component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {any} state - Initial state for setup
 * @returns {ShallowWrapper}
 */

const mockStore = configureMockStore();

const setup = (props = {}, state = null) => {
  return shallow(<Header {...props} />);
};

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
  it("renders without error", () => {
    const headerComponent = wrapper.find("[data-test='component-header']");

    // expect(wrapper.exists()).toBe(true);
  });

  it("renders with header classname", () => {
    expect(wrapper.exists(".header")).toBe(true);
  });
});

// describe("Header Component, snapshot testing", () => {
//   const store = mockStore({
//     stateUser: {
//       currentUser: {
//         role: "admin",
//         state: { id: "NY", name: "New York" },
//         username: "karen.dalton@state.gov",
//       },
//     },
//   });

//   const snapShot = renderer.create(
//     <Provider store={store}>
//       <Header />
//     </Provider>
//   );

//   it("should render with given state from Redux store", () => {
//     expect(snapShot.toJSON()).toMatchSnapshot();
//   });
// });
