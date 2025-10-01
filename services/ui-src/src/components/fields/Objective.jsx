import React from "react";
import PropTypes from "prop-types";
import { AccordionItem } from "@cmsgov/design-system";

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
    <AccordionItem
      ref={headerRef}
      defaultOpen
      heading={objectiveName(objectiveNumber, name, suggested)}
      isControlledOpen={printView ?? undefined}
      onChange={printView ? () => {} : undefined}
    >
      {children.map((q) => (
        <div className="ds-c-choice__checkedChild" key={q.id}>
          <Question question={q} printView={printView} />
        </div>
      ))}
    </AccordionItem>
  );
};

Objective.propTypes = {
  headerRef: PropTypes.object.isRequired,
  objective: PropTypes.object.isRequired,
  objectiveNumber: PropTypes.number.isRequired,
  printView: PropTypes.bool,
};
