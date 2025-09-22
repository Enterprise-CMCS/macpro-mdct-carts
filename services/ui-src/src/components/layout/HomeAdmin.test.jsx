import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import HomeAdmin from "./HomeAdmin";
import { mockInitialState } from "../../util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/CMSHomepage", () => () => {
  return <p>default-cms-home</p>;
});

window.scrollTo = jest.fn();

describe("<HomeAdmin />", () => {
  test("should load the homepage for admin users", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <HomeAdmin />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("default-cms-home")).toBeVisible();
  });
});
