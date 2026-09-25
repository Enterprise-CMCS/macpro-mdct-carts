import React from "react";
import { render, screen } from "@testing-library/react";
import { Objective } from "./Objective";
import { Accordion } from "@cmsgov/design-system";

describe("Objective component", () => {
  test("renders", () => {
    const props = {
      headerRef: { current: {} },
      objective: {
        questions: [
          {
            answer: {
              readonly: true,
              default_entry: 0,
              entry: 1,
            },
          },
        ],
      },
      objectiveNumber: 1,
      printView: false,
    };
    render(
      <Accordion>
        <Objective {...props} />
      </Accordion>
    );
    expect(screen.getByText("Objective 1 (required)")).toBeInTheDocument();
  });

  test("marks the accordion button as aria-disabled in print view", () => {
    const props = {
      headerRef: { current: {} },
      objective: {
        questions: [
          {
            answer: {
              readonly: true,
              default_entry: 0,
              entry: 1,
            },
          },
        ],
      },
      objectiveNumber: 1,
      printView: true,
    };
    render(
      <Accordion>
        <Objective {...props} />
      </Accordion>
    );
    expect(
      screen.getByRole("button", { name: "Objective 1 (required)" })
    ).toHaveAttribute("aria-disabled", "true");
  });
});
