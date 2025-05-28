import React from "react";
import Unauthorized from "./Unauthorized";
import { render, screen } from "@testing-library/react";

const unauthorized = <Unauthorized />;

describe("Unauthorized Component", () => {
  it("should render correctly", () => {
    render(unauthorized);
    expect(screen.getByRole("heading", { name: "Unauthorized" })).toBeVisible();
  });
});
