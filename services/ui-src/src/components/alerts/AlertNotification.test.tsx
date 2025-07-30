import React from "react";
import { render, screen } from "@testing-library/react";
import { AlertNotification } from "./AlertNotification";
import { AlertVariation } from "@cmsgov/design-system/dist/types/Alert/Alert";

jest.mock("@cmsgov/design-system", () => ({
  Alert: ({ variation, heading, children }: any) => (
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
        variation={"error" as AlertVariation}
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
