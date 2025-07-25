import React from "react";
import { render, screen } from "@testing-library/react";
import { Objective } from "./Objective";
import { Accordion, AccordionItem } from "@reach/accordion";

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
        <AccordionItem key={"mock-item-1"}>
          <Objective {...props} />
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Objective 1")).toBeInTheDocument();
  });
});
