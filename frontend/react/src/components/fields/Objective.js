import React from "react";
import { AccordionButton, AccordionPanel } from "@reach/accordion";
import Question from "../layout/Question";

const Objective = ({ objective, objectiveNumber }) => {
  const first = objective.questions[0].answer.readonly == true;
  const name = first
    ? objective.questions[0].answer.default_entry
    : objective.questions[0].answer.entry;

  const children = first ? objective.questions.slice(1) : objective.questions;

  return (
    <>
      <div className="accordion-header">
        <h3>
          <AccordionButton>
            <div className="accordion-title">
              Objective {objectiveNumber}
              {name ? `: ${name}` : null}
            </div>
          </AccordionButton>
        </h3>
      </div>
      <AccordionPanel>
        {children.map((q) => (
          <div className="ds-c-choice__checkedChild">
            <Question key={q.id} question={q} type="Goal" />
          </div>
        ))}
      </AccordionPanel>
    </>
  );
};

export { Objective };
