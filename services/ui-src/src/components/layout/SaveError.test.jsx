import React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import SaveError from "./SaveError";
import { render, screen } from "@testing-library/react";

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

describe("Save Error Component", () => {
  it("should display an error when an error exists", () => {
    render(saveError);
    expect(screen.getByRole("alertdialog")).toBeVisible();
  });
  it("should not display an error when saved", () => {
    render(noSaveError);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
