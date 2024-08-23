import React from "react";
import { shallow } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import Timeout from "./Timeout";
import moment from "moment";
import { MemoryRouter } from "react-router-dom";

const mockedUsedLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => ({
    listen: jest.fn().mockReturnValue(() => {}),
  }),
  useLocation: () => mockedUsedLocation,
}));

const mockStore = configureMockStore();
const store = mockStore({
  stateUser: {
    showTimeout: true,
    expiresAt: moment().add(5, "minutes"),
  },
});

const timeout = (
  <Provider store={store}>
    <MemoryRouter>
      <Timeout />
    </MemoryRouter>
  </Provider>
);
const mockLogout = jest.fn();
const mockRefreshCredentials = jest.fn();
jest.mock("../../hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    logout: mockLogout,
  })),
  refreshCredentials: () => mockRefreshCredentials(),
}));

const user = { id: "123" }; // just needs an obj
jest.mock("../../hooks/authHooks", () => ({
  useUser: jest.fn(() => ({
    user: user,
    userRole: "STATE_USER",
    showLocalLogins: false,
    showTimeout: false,
    expiresAt: null,
    logout: jest.fn(),
  })),
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
}));

describe("Timeout Component", () => {
  it("should render correctly", () => {
    expect(shallow(timeout).exists()).toBe(true);
  });
});
