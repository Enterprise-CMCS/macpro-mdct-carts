import React from "react";
import { Accordion, AccordionItem } from "@reach/accordion";
import { render, screen } from "@testing-library/react";
import Repeatable from "./Repeatable";

const mockQuestion = jest.fn(() => <div data-testid="question" />);
jest.mock("./Question", () => (props) => mockQuestion(props));

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
    expect(
      screen.getByRole("button", { name: "mock repeatable 1" })
    ).toBeVisible();
    expect(mockQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        question: { id: "mock q 1" },
        printView: false,
      })
    );
  });
});
