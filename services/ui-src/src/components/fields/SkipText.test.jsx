import React from "react";
import { render, screen } from "@testing-library/react";
import SkipText from "./SkipText";
import { testA11y } from "../../util/testing/testUtils";

const wrapper = <SkipText question={{ skip_text: "Render text" }} />;

describe("<SkipText />", () => {
  test("should render correctly", () => {
    render(wrapper);
    expect(screen.getByText("Render text")).toBeVisible();
  });

  testA11y(wrapper);
});
