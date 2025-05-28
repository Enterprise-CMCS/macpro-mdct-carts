import React from "react";
import Autosave from "./Autosave";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { render, screen } from "@testing-library/react";

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

describe("AutoSave Component", () => {
  it("should display saving when waiting", () => {
    render(autoSaveSaving);
    expect(screen.getByText("Saving...")).toBeVisible();
  });
  it("should display save message when saved", () => {
    render(autoSave);
    expect(screen.getByText(/Last saved/)).toBeVisible();
  });
});
