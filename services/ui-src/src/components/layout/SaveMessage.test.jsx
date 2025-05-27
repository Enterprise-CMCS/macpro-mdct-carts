import React from "react";
import SaveMessage from "./SaveMessage";
import { render, screen } from "@testing-library/react";

describe("SaveMessage Component", () => {
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

  it("should accept date as prop", () => {
    render(saveMessageDateProp);
    expect(screen.getByText(/Saved/)).toBeVisible();
  });

  it("should accept null as prop and return not saved", () => {
    render(saveMessageNullProp);
    expect(screen.getByText("Not yet saved")).toBeVisible();
  });
});
