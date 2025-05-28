import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import App from "./App";
import {
  mockInitialState,
  RouterWrappedComponent,
} from "./util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);

describe("<App />", () => {
  test("renders without crashing", () => {
    const { container } = render(
      <RouterWrappedComponent>
        <Provider store={store}>
          <App />
        </Provider>
      </RouterWrappedComponent>
    );
    expect(container.querySelector("#app-wrapper")).toBeVisible();
  });
});
