import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

import configureStore from "redux-mock-store";

import Header from "../Header";

const mockStore = configureStore([]);

describe("Header Component", () => {
  // beforeEach(() => {

  // });

  it("should render with given store from redux", () => {
    let store;
    let component;
    store = mockStore({
      currentUser: {
        role: "admin",
        state: { id: "NY", name: "New York" },
        username: "grace.lafayette@state.gov",
      },
    });

    // store.dispatch = jest.fn();

    component = mount(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("opens and closes the dropdown when clicked ", () => {
    // const component = shallow(<Header />);
    // jest.spyOn(component, "toggleUserNav");
    // component.find(".nav--dropdown__trigger").simulate("click");
    // expect(component).toMatchSnapshot();
    // expect(document.toggleUserNav).toHaveBeenCalled();
    // expect(document.getElementById("menu-block").classList).toContain("open");
    // expect(document.addEventListener.mock.calls[0][0]).toEqual("click");
    // const handler = document.addEventListener.mock.calls[0][1];
    // component.find(".nav--dropdown__trigger").simulate("click");
    // expect(component.state().ariaExpanded).toBeFalsy();
    // expect(document.removeEventListener).toHaveBeenCalled();
    // expect(document.removeEventListener.mock.calls[0][0]).toEqual("click");
    // expect(document.removeEventListener.mock.calls[0][1]).toEqual(handler);
  });
});
