import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import StateHome from "./HomeState";
import { render, screen } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/Homepage", () => () => {
  return <p>cms-home</p>;
});

window.scrollTo = jest.fn();

describe("Home State Component", () => {
  it("should load the homepage for state users", () => {
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
