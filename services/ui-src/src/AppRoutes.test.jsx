import React from "react";
import { mount, shallow } from "enzyme";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AppRoutes from "./AppRoutes";
import { mockInitialState } from "./util/testing/testUtils";
import { AppRoles } from "./types";
import InvokeSection from "./components/utils/InvokeSection";
import CertifyAndSubmit from "./components/layout/CertifyAndSubmit";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
const mockStateUser = { id: "123", userRole: AppRoles.STATE_USER }; // just needs an obj
jest.mock("./hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    user: mockStateUser,
    userRole: "STATE_USER",
    showLocalLogins: false,
    showTimeout: false,
    expiresAt: null,
  })),
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
}));

jest.mock("./components/utils/InvokeSection", () => () => {
  const MockName = "default-invoke";
  return <MockName />;
});

jest.mock("./components/layout/CertifyAndSubmit", () => () => {
  const MockName = "default-cert";
  return <MockName />;
});

jest.mock("./components/sections/homepage/TemplateDownload", () => (props) => (
  <div data-testid="template-download-mock">{JSON.stringify(props)}</div>
));

window.scrollTo = jest.fn();

describe("App Router", () => {
  it("should render", () => {
    expect(shallow(<AppRoutes />).exists()).toBe(true);
  });

  describe("State User Role", () => {
    it("should render the state user Homepage", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/"]}>
            <AppRoutes />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("CHIP Annual Reporting Template System (CARTS)"));
      expect(screen.getByText("All Reports"));
    });

    it("should render the state user Profile page", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/user/profile"]}>
            <AppRoutes />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("User Profile"));
      expect(screen.getByText(mockInitialState.stateUser.currentUser.username));
    });

    it("should render the Get Help page", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/get-help"]}>
            <AppRoutes />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("How can we help you?"));
      expect(screen.getByText("For technical support and login issues:"));
    });

    it.each([
      ["/sections/2022/3/2", <InvokeSection />],
      ["/sections/2022/3", <InvokeSection />],
      ["/sections/2022/certify-and-submit", <CertifyAndSubmit />],
    ])(
      "should attempt to load the appropriate components for the path %s",
      (route, component) => {
        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
              <AppRoutes />
            </MemoryRouter>
          </Provider>
        );
        expect(wrapper.containsMatchingElement(component)).toEqual(true);
      }
    );

    it("should render the Not Found page if given a random url", () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/help-me-obiwan-kenobi"]}>
            <AppRoutes />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Page not found"));
    });
  });
});
