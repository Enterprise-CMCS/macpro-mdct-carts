import React from "react";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "./util/testing/mockRouter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AppRoutes from "./AppRoutes";
import { mockInitialState } from "./util/testing/testUtils";
import { AppRoles } from "./types";

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
  return <p>default-invoke</p>;
});

jest.mock("./components/layout/CertifyAndSubmit", () => () => {
  return <p>default-cert</p>;
});

jest.mock("./components/sections/homepage/TemplateDownload", () => (props) => (
  <div data-testid="template-download-mock">{JSON.stringify(props)}</div>
));

window.scrollTo = jest.fn();

describe("<AppRoutes />", () => {
  describe("State User Role", () => {
    test("should render the state user Homepage", () => {
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

    test("should render the state user Profile page", () => {
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

    test("should render the Get Help page", () => {
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

    test.each([
      ["/sections/2022/3/2", "default-invoke"],
      ["/sections/2022/3", "default-invoke"],
      ["/sections/2022/certify-and-submit", "default-cert"],
    ])(
      "should attempt to load the appropriate components for the path %s",
      (route, expectedText) => {
        render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
              <AppRoutes />
            </MemoryRouter>
          </Provider>
        );
        expect(screen.getByText(expectedText)).toBeVisible();
      }
    );

    test("should render the Not Found page if given a random url", () => {
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
