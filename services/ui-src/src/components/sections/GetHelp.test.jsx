import React from "react";
import { render, screen } from "@testing-library/react";
import GetHelp from "./GetHelp";
import { testA11y } from "../../util/testing/testUtils";

const wrapper = <GetHelp />;

describe("<GetHelp />", () => {
  test("should render the help page container", () => {
    render(wrapper);
    expect(screen.getByText(/How can we help you\?/i)).toBeInTheDocument();
  });

  test("should render ActionCard with technical support text", () => {
    render(wrapper);
    expect(
      screen.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
    expect(
      screen.getByText(/For technical support and login issues:/i)
    ).toBeInTheDocument();
    expect(screen.getByText("mdct_help@cms.hhs.gov")).toBeVisible();
  });

  testA11y(wrapper);
});
