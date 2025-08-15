import React from "react";
import { render, screen } from "@testing-library/react";
import { Main } from "./Main";

describe("Main component", () => {
  test("renders", () => {
    render(<Main />);
    expect(screen.getByRole("main")).toBeVisible();
  });

  test("renders children", () => {
    render(
      <Main>
        <p>text nested in main</p>
      </Main>
    );
    expect(screen.getByRole("main")).toBeVisible();
    expect(screen.getByText("text nested in main")).toBeVisible();
  });

  test("accepts only parameterized props", () => {
    render(
      <Main
        id="test-main-id"
        className="test-class"
        data-testid="not-passed-in"
      />
    );
    expect(
      screen.getByRole("main", { id: "test-main-id", className: "test-class" })
    ).toBeVisible();
    expect(screen.queryByTestId("not-passed-in")).not.toBeInTheDocument();
  });
});
