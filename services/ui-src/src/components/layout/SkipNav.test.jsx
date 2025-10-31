import React from "react";
import { render, screen } from "@testing-library/react";
import SkipNav from "./SkipNav";

const skipNav = (
  <SkipNav
    id="skip-nav-main"
    href="#main-content"
    text="Skip to main content"
  />
);

describe("<SkipNav />", () => {
  test("should have correct id attribute", () => {
    render(skipNav);

    expect(screen.getByRole("link")).toHaveAttribute("id", "skip-nav-main");
  });

  test("should have correct href attribute", () => {
    render(skipNav);

    expect(screen.getByRole("link")).toHaveAttribute("href", "#main-content");
  });

  test("should contain text", () => {
    render(skipNav);

    expect(screen.getByRole("link")).toHaveTextContent("Skip to main content");
  });
});
