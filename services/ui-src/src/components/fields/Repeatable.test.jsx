import React from "react";
import { Accordion, AccordionItem } from "@reach/accordion";
import { render, screen } from "@testing-library/react";
import Repeatable from "./Repeatable";

jest.mock("./Question", () => () => <div data-testid="question" />);

describe("Repeatable component", () => {
  test("renders", () => {
    const props = {
      headerRef: { current: {} },
      number: 1,
      type: "mock repeatable",
      question: {
        questions: [
          {
            id: "mock q 1",
          },
        ],
      },
      printView: false,
    };
    render(
      <Accordion>
        <AccordionItem key={"mock-item-1"}>
          <Repeatable {...props} />
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("mock repeatable 1")).toBeInTheDocument();
    expect(screen.getByTestId("question")).toBeInTheDocument();
  });
});
