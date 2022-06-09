import React from "react";
import { shallow } from "enzyme";
import FormActions from "./FormActions";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({});
const formActions = (
  <Provider store={store}>
    <FormActions />
  </Provider>
);

describe("Fill Form Component", () => {
  it("should render correctly", () => {
    expect(shallow(formActions).exists()).toBe(true);
  });
});
