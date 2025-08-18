import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";

import Question from "./Question";

export const Objective = ({
  headerRef,
  objective,
  objectiveNumber,
  printView,
}) => {
  const firstQuestion = objective.questions?.[0];
  let children = [];
  let name = "";
  let suggested = false;

  if (firstQuestion) {
    const firstQuestionIsReadOnly = firstQuestion.answer.readonly === true;

    name = firstQuestionIsReadOnly
      ? firstQuestion.answer.default_entry
      : firstQuestion.answer.entry;

    suggested = firstQuestion?.suggested;

    children = firstQuestionIsReadOnly
      ? objective.questions.slice(1)
      : objective.questions;
  }

  const objectiveName = (number, name, suggested) => {
    let createdName = `Objective ${number}`;

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
            <div className="accordion-title">
              {objectiveName(objectiveNumber, name, suggested)}
            </div>
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
