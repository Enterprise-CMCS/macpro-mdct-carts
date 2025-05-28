import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import {
  mockInitialState,
  RouterWrappedComponent,
} from "./util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
it("renders without crashing", () => {
  const { container } = render(
    <RouterWrappedComponent>
      <Provider store={store}>
        <App />
      </Provider>
    </RouterWrappedComponent>
  );
  expect(container.querySelector("#app-wrapper")).toBeVisible();
});
