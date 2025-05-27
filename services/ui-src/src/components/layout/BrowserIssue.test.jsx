import React from "react";
import BrowserIssue from "./BrowserIssue";
import { render, screen } from "@testing-library/react";

const issue = <BrowserIssue />;

describe("Browser Issue Component", () => {
  it("should render correctly", () => {
    render(issue);
    expect(
      screen.getByRole("heading", { name: "Browser Problem" })
    ).toBeVisible();
  });
});
