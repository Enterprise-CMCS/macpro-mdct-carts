import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import StateHome from "./HomeState";
import Homepage from "../sections/homepage/Homepage";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/Homepage", () => () => {
  const MockName = "default-cms-home";
  return <MockName />;
});

window.scrollTo = jest.fn();

describe("Home State Component", () => {
  it("should render correctly", () => {
    expect(shallow(<StateHome />).exists()).toBe(true);
  });
  it("should load the homepage for state users", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <StateHome />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.containsMatchingElement(<Homepage />)).toEqual(true);
  });
});
