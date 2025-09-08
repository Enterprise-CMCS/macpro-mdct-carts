import React from "react";
import { render, screen } from "@testing-library/react";
import FaqAccordion from "./FaqAccordion";

const items = [
  {
    question: "What is Medicaid?",
    type: "text",
    answer: "Medicaid is a health insurance program.",
  },
  {
    question: "Who is eligible?",
    type: "list",
    listHeading: "Eligibility criteria:",
    listAnswers: ["Low income", "Pregnant women", "Children"],
  },
];

describe("FaqAccordion", () => {
  it("renders all questions", () => {
    render(<FaqAccordion accordionItems={items} />);
    expect(screen.getByText("What is Medicaid?")).toBeInTheDocument();
    expect(screen.getByText("Who is eligible?")).toBeInTheDocument();
  });

  it("renders text answers", () => {
    render(<FaqAccordion accordionItems={items} />);
    expect(
      screen.getByText("Medicaid is a health insurance program.")
    ).toBeInTheDocument();
  });

  it("renders list answers and heading", () => {
    render(<FaqAccordion accordionItems={items} />);
    expect(screen.getByText("Eligibility criteria:")).toBeInTheDocument();
    expect(screen.getByText("Low income")).toBeInTheDocument();
    expect(screen.getByText("Pregnant women")).toBeInTheDocument();
    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("renders nothing for unknown type", () => {
    const badItems = [{ question: "Bad", type: "unknown" }];
    render(<FaqAccordion accordionItems={badItems} />);
    expect(screen.queryByText("Bad")).toBeInTheDocument();
    // Should not render any answer
    expect(screen.queryByText(/faqanswer-/)).not.toBeInTheDocument();
  });
});
