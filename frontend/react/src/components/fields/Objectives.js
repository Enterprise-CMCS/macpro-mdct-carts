import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem } from "@reach/accordion";

import { Objective } from "./Objective"; // eslint-disable-line import/no-cycle
import { createNewObjective } from "../../actions/repeatables";

const Objectives = ({ addObjectiveTo, question }) => {
  const add = () => {
    addObjectiveTo(question.id);
  };

  return (
    <>
      <Accordion
        collapsible
        multiple
        defaultIndex={[...Array(100)].map((_, i) => i)}
      >
        {question.questions.map((q, i) => (
          <AccordionItem key={q.id}>
            <Objective objective={q} objectiveNumber={i + 1} />
          </AccordionItem>
        ))}
      </Accordion>

      <div className="section-footer">
        <h3 className="question-inner-header">
          Do you have another objective in your State Plan?
        </h3>

        <div className="ds-c-field__hint">Optional</div>
        <button
          onClick={add}
          type="button"
          className="add-objective ds-c-button ds-c-button--primary"
        >
          Add another objective
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </>
  );
};
Objectives.propTypes = {
  addObjectiveTo: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

const mapDispatchToProps = { addObjectiveTo: createNewObjective };

const ConnectedObjectives = connect(null, mapDispatchToProps)(Objectives);

export { ConnectedObjectives as Objectives };
export default ConnectedObjectives;
