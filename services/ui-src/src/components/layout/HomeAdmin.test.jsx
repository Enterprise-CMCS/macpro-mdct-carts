import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import HomeAdmin from "./HomeAdmin";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/CMSHomepage", () => () => {
  const MockName = "default-cms-home";
  return <MockName />;
});

window.scrollTo = jest.fn();

describe("Home Admin Component", () => {
  it("should render correctly", () => {
    expect(shallow(<HomeAdmin />).exists()).toBe(true);
  });
  it("should load the homepage for admin users", () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <HomeAdmin />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.containsMatchingElement(<CMSHomepage />)).toEqual(true);
  });
});
