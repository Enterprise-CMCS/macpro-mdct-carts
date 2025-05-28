import React from "react";
import { render, screen } from "@testing-library/react";
import GetHelp from "./GetHelp";
import { testA11y } from "../../util/testing/testUtils";

const wrapper = <GetHelp />;

describe("<GetHelp />", () => {
  test("should render correctly and show cms email", () => {
    render(wrapper);
    expect(
      screen.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
    expect(screen.getByText("mdct_help@cms.hhs.gov")).toBeVisible();
  });

  testA11y(wrapper);
});
