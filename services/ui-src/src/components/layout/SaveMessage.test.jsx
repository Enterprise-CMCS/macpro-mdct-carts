import React from "react";
import { render, screen } from "@testing-library/react";
import SaveMessage from "./SaveMessage";

describe("<SaveMessage />", () => {
  const stringProp = { lastSaved: "01/01/2002" };
  const saveMessageStringProp = <SaveMessage {...stringProp} />;

  const dateProp = { lastSaved: new Date() };
  const saveMessageDateProp = <SaveMessage {...dateProp} />;

  const nullProp = { lastSaved: null };
  const saveMessageNullProp = <SaveMessage {...nullProp} />;

  test("render component", () => {
    render(saveMessageStringProp);
    expect(screen.getByText(/Last saved/)).toBeVisible();
  });

  test("should accept date as prop", () => {
    render(saveMessageDateProp);
    expect(screen.getByText(/Saved/)).toBeVisible();
  });

  test("should accept null as prop and return not saved", () => {
    render(saveMessageNullProp);
    expect(screen.getByText("Not yet saved")).toBeVisible();
  });
});
