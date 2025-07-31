import React from "react";
import { render, screen } from "@testing-library/react";
import { AlertNotification } from "./AlertNotification";

jest.mock("@cmsgov/design-system", () => ({
  Alert: ({ variation, heading, children }) => (
    <div data-testid="alert" data-variation={variation}>
      <h2>{heading}</h2>
      {children}
    </div>
  ),
}));

describe("AlertNotification", () => {
  it("renders the title and description correctly", () => {
    render(
      <AlertNotification
        title="Login Error"
        description="Invalid username or password."
        variation="error"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Login Error" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Invalid username or password.")
    ).toBeInTheDocument();

    expect(screen.getByTestId("alert")).toHaveAttribute(
      "data-variation",
      "error"
    );
  });
});
