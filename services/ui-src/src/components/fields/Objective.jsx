import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";

import Question from "./Question";

const Objective = ({ headerRef, objective, objectiveNumber, printView }) => {
  const firstQuestion = objective.questions[0];
  const firstQuestionIsReadOnly = firstQuestion.answer.readonly === true;
  const name = firstQuestionIsReadOnly
    ? firstQuestion.answer.default_entry
    : firstQuestion.answer.entry;

  const suggested = firstQuestion?.suggested;

  const children = firstQuestionIsReadOnly
    ? objective.questions.slice(1)
    : objective.questions;

  const objectiveName = () => {
    let createdName = `Objective ${objectiveNumber}`;

    if (suggested) {
      createdName = `${createdName} (suggested)`;
    }

    if (name) {
      createdName = `${createdName}: ${name}`;
    }

    return createdName;
  };

  return (
    <>
      <div className="accordion-header" ref={headerRef}>
        <span className="span-pdf-no-bookmark">
          <AccordionButton>
            <div className="accordion-title">{objectiveName()}</div>
          </AccordionButton>
        </span>
      </div>
      <AccordionPanel>
        {children.map((q) => (
          <div className="ds-c-choice__checkedChild" key={q.id}>
            <Question question={q} printView={printView} />
          </div>
        ))}
      </AccordionPanel>
    </>
  );
};
Objective.propTypes = {
  headerRef: PropTypes.object.isRequired,
  objective: PropTypes.object.isRequired,
  objectiveNumber: PropTypes.number.isRequired,
  printView: PropTypes.bool,
};
