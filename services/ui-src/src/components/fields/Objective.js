import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";

import Question from "./Question"; // eslint-disable-line import/no-cycle

const Objective = ({ headerRef, objective, objectiveNumber }) => {
  const first = objective.questions[0].answer.readonly === true;
  const name = first
    ? objective.questions[0].answer.default_entry
    : objective.questions[0].answer.entry;

  const children = first ? objective.questions.slice(1) : objective.questions;

  return (
    <>
      <div className="accordion-header" ref={headerRef}>
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
            <Question key={q.id} question={q} />
          </div>
        ))}
      </AccordionPanel>
    </>
  );
};
Objective.propTypes = {
  headerRef: PropTypes.func.isRequired,
  objective: PropTypes.object.isRequired,
  objectiveNumber: PropTypes.number.isRequired,
};

export { Objective };
export default Objective;
