import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mockInitialState } from "./util/testing/testUtils";

const mockStore = configureMockStore();
const store = mockStore(mockInitialState);
it("renders without crashing", () => {
  expect(
    shallow(
      <Provider store={store}>
        <App />
      </Provider>
    ).exists()
  ).toBe(true);
});
