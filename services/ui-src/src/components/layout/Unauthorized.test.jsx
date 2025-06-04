import React from "react";
import { render, screen } from "@testing-library/react";
import Unauthorized from "./Unauthorized";

const unauthorized = <Unauthorized />;

describe("<Unauthorized />", () => {
  test("should render correctly", () => {
    render(unauthorized);
    expect(screen.getByRole("heading", { name: "Unauthorized" })).toBeVisible();
  });
});
