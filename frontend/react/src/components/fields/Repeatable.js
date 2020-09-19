import React from "react";
import { AccordionButton, AccordionPanel } from "@reach/accordion";
import Question from "../layout/Question";

const Repeatable = ({ number, question, type }) => {
  const children = question.questions ? question.questions : [];

  const title = type ? `${type} ${number}` : `${number}`;

  return (
    <>
      <div className="accordion-header">
        <h3>
          <AccordionButton>
            <div className="accordion-title">{title}</div>
          </AccordionButton>
        </h3>
      </div>
      <AccordionPanel>
        {children.map((q) => (
          <Question key={q.id} question={q} />
        ))}
      </AccordionPanel>
    </>
  );
};

export { Repeatable };
