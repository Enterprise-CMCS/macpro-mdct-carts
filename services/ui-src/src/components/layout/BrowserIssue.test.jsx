import React from "react";
import { render, screen } from "@testing-library/react";
import BrowserIssue from "./BrowserIssue";

const issue = <BrowserIssue />;

describe("<BrowserIssue />", () => {
  test("should render correctly", () => {
    render(issue);
    expect(
      screen.getByRole("heading", { name: "Browser Problem" })
    ).toBeVisible();
  });
});
