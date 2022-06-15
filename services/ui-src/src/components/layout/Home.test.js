import React from "react";
import { mount, shallow } from "enzyme";
import Home from "./Home";
import { UserRoles } from "../../types";
import HomeAdmin from "./HomeAdmin";
import Unauthorized from "./Unauthorized";
import CMSHome from "./HomeCMS";
import StateHome from "./HomeState";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({});

jest.mock("./HomeAdmin", () => () => {
  const MockName = "default-home";
  return <MockName />;
});
jest.mock("./HomeCMS", () => () => {
  const MockName = "default-cms";
  return <MockName />;
});
jest.mock("./HomeState", () => () => {
  const MockName = "default-home";
  return <MockName />;
});
jest.mock("./Unauthorized", () => () => {
  const MockName = "default-unauthorized";
  return <MockName />;
});

describe("Home Component", () => {
  it("should render correctly", () => {
    expect(shallow(<Home />).exists()).toBe(true);
  });
  it.each([
    [UserRoles.APPROVER, <CMSHome />],
    [UserRoles.BUSINESS_OWNER_REP, <HomeAdmin />],
    [UserRoles.HELP, <CMSHome />],
    [UserRoles.PROJECT_OFFICER, <CMSHome />],
    [UserRoles.STATE, <StateHome />],
    ["", <Unauthorized />],
  ])("User role %s should see the matching homepage)", (role, expected) => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Home role={role} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.containsMatchingElement(expected)).toEqual(true);
  });
});
