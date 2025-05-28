import React from "react";
import CMSHome from "./HomeCMS";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "../../util/testing/testUtils";
import { render, screen } from "@testing-library/react";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
jest.mock("../sections/homepage/CMSHomepage", () => () => {
  return <p>cms-home</p>;
});
jest.mock("../utils/InvokeSection", () => () => {
  return <p>invoke-section</p>;
});

window.scrollTo = jest.fn();

describe("Home CMS Component", () => {
  it.each([
    ["/views/sections/pa/2022/3/2", "invoke-section"],
    ["/views/sections/pa/2022/3", "invoke-section"],
    ["/", "cms-home"],
  ])(
    "Home CMS should attempt to load the appropriate section for the path %s",
    (route, expected) => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <CMSHome />
          </MemoryRouter>
        </Provider>
      );
      expect(screen.getByText(expected)).toBeVisible();
    }
  );
});
