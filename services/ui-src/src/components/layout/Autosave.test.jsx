import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "../../util/testing/mockRouter";
import configureMockStore from "redux-mock-store";
import Autosave from "./Autosave";

const mockStore = configureMockStore();
const lastSaved = "01/01/2002";
const store = mockStore({
  save: {
    error: false,
    saving: false,
    lastSave: lastSaved,
  },
});
const savingStore = mockStore({
  save: {
    error: false,
    saving: true,
    lastSave: lastSaved,
  },
});

const autoSave = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/"]}>
      <Autosave />
    </MemoryRouter>
  </Provider>
);
const autoSaveSaving = (
  <Provider store={savingStore}>
    <Autosave />
  </Provider>
);

describe("<AutoSave />", () => {
  test("should display saving when waiting", () => {
    render(autoSaveSaving);
    expect(screen.getByText("Saving...")).toBeVisible();
  });
  test("should display save message when saved", () => {
    render(autoSave);
    expect(screen.getByText(/Last saved/)).toBeVisible();
  });
});
