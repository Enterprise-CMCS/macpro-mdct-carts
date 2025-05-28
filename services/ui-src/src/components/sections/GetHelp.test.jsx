import React from "react";

import { axe } from "jest-axe";
import GetHelp from "./GetHelp";
import { render, screen } from "@testing-library/react";

const wrapper = <GetHelp />;

describe("<GetHelp />", () => {
  it("should render correctly and show cms email", () => {
    render(wrapper);
    expect(
      screen.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
    expect(screen.getByText("mdct_help@cms.hhs.gov")).toBeVisible();
  });
});

describe("Test <GetHelp /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wrapper);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
