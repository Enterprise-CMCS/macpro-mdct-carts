import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { mount, shallow } from "enzyme";
import SaveError from "./SaveError";

const mockStore = configureMockStore();
const lastSaved = "01/01/2002";
const store = mockStore({
  save: {
    error: true,
    saving: false,
    lastSave: lastSaved,
  },
});
const noErrorStore = mockStore({
  save: {
    error: false,
    saving: true,
    lastSave: lastSaved,
  },
});

const saveError = (
  <Provider store={store}>
    <SaveError />
  </Provider>
);
const noSaveError = (
  <Provider store={noErrorStore}>
    <SaveError />
  </Provider>
);
const activeErrorClass = ".alert--unexpected-error__active";

describe("Save Error Component", () => {
  it("should render correctly", () => {
    expect(shallow(saveError).exists()).toBe(true);
  });
  it("should display an error when an error exists", () => {
    const wrapper = mount(saveError);
    expect(wrapper.find(activeErrorClass).exists()).toBeTruthy();
  });
  it("should not display an error when saved", () => {
    const wrapper = mount(noSaveError);
    expect(wrapper.find(activeErrorClass).exists()).toBeFalsy();
  });
});
