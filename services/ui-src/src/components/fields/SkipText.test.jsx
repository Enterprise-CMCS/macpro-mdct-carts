import React from "react";

import { axe } from "jest-axe";
import SkipText from "./SkipText";
import { render, screen } from "@testing-library/react";

const wrapper = <SkipText question={{ skip_text: "Render text" }} />;

describe("<SkipText />", () => {
  it("should render correctly", () => {
    render(wrapper);
    expect(screen.getByText("Render text")).toBeVisible();
  });
});

describe("Test <SkipText /> accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(wrapper);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
