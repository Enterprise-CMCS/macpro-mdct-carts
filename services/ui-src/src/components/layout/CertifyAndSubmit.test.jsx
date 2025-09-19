import React from "react";
import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "../../util/testing/mockRouter";
import configureMockStore from "redux-mock-store";
import CertifyAndSubmit from "./CertifyAndSubmit";
import { AppRoles } from "../../types";

jest.mock("../../actions/initial", () => ({
  loadForm: () => ({ type: "none" }),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const mockStore = configureMockStore();
const store = mockStore({
  save: { lastSave: new Date() },
  reportStatus: {
    status: "in_progress",
    KY2011: {
      status: "in_progress",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
  stateUser: {
    abbr: "KY",
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 2011,
  },
});
const submittedStore = mockStore({
  save: { lastSave: new Date() },
  reportStatus: {
    status: "certified",
    KY2011: {
      status: "certified",
      username: "my_user@name.com",
      lastChanged: new Date(),
    },
  },
  stateUser: {
    abbr: "KY",
    currentUser: {
      role: AppRoles.STATE_USER,
    },
  },
  global: {
    formYear: 2011,
  },
});

const submit = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <CertifyAndSubmit />
    </MemoryRouter>
  </Provider>
);
const submitFinished = (
  <Provider store={submittedStore}>
    <CertifyAndSubmit />
  </Provider>
);

describe("<CertifyAndSubmit />", () => {
  test("should display submit button", () => {
    render(submit);
    const thankYouElement = screen.getByTestId("certifySubmit");
    expect(thankYouElement).toHaveTextContent("Certify and Submit");
  });
  test("should display thanks after submit", () => {
    render(submitFinished);
    const thankYouElement = screen.getByTestId("certifyThankYou");
    expect(thankYouElement).toHaveTextContent("Thank you");
  });
});
