import React from "react";
import { render, screen } from "@testing-library/react";
import FaqAccordion from "./FaqAccordion";

describe("FaqAccordion", () => {
  it("renders FAQ accordion", () => {
    render(<FaqAccordion />);

    //Headers
    expect(
      screen.getByText(
        "What types of questions should I contact MCDT Help Desk for assistance?"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("How can I “uncertify” a report to make edits?")
    ).toBeInTheDocument();

    //Answers
    expect(
      screen.getByText(
        /Basic State Information \(pre-filled from previous Federal fiscal year CARTS\)/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Section 2, Part 1 \(Statistical Enrollment Data System\) and Part 2 \(American Community Survey\)/
      )
    ).toBeInTheDocument();
  });
});
