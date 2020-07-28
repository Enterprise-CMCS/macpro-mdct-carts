import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import MemoryRouter from "react-router";

const mockStore = configureStore([]);

describe("renders necessary components (shallow)", () => {
  it("renders without error", () => {
    const wrapper = shallow(<App />);
    const appComponent = wrapper.find("[data-test='component-app']");
    expect(appComponent.length).toBe(1);
  });
  it("has the appropriate classname", () => {
    const wrapper = shallow(<App />);
    const appComponent = wrapper.find(".App");
    expect(appComponent.length).toBe(1);
  });
});

// describe("renders necessary components (mounted)", () => {
//   it("renders without error", () => {
//     const wrapper = shallow(<App />);
//     const appComponent = wrapper.find("[data-test='component-app']");
//     expect(appComponent.length).toBe(1);
//   });
//   it("has the appropriate classname", () => {
//     const wrapper = shallow(<App />);
//     const appComponent = wrapper.find(".App");
//     expect(appComponent.length).toBe(1);
//   });

// it("renders header (mounted)", () => {
//   const wrapper = shallow(<App />);
//   const appComponent = wrapper.find("[data-test='component-header']");
//   expect(appComponent.length).toBe(1);
// });

// let store;
// beforeEach(() => {
//   store = mockStore({
//     stateUser: {
//       currentUser: {
//         role: "admin",
//         state: { id: "NY", name: "New York" },
//         username: "karen.dalton@state.gov",
//       },
//     },
//   });
//   let wrapper = mount(
//     <MemoryRouter initialEntries={["/basic-info"]}>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </MemoryRouter>
//   );
// });

// it("App renders", () => {
//   expect(wrapper.exists(".App")).toBe(true);
// });
// it("header renders", () => {
//   expect(wrapper.exists(".header")).toBe(true);
// });
// it("footer renders", () => {
//   expect(wrapper.exists(".footer")).toBe(true);
// });

// it("sidebar renders", () => {
//   expect(wrapper.exists(".sidebar")).toBe(true);
// });
