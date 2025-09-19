import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "../../util/testing/mockRouter";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import StateHome from "./HomeState";
import { mockInitialState } from "../../util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/Homepage", () => () => {
  return <p>cms-home</p>;
});

window.scrollTo = jest.fn();

describe("<StateHome />", () => {
  test("should load the homepage for state users", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <StateHome />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("cms-home")).toBeVisible();
  });
});
