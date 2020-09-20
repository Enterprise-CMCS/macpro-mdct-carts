import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem } from "@reach/accordion";

import { Repeatable } from "./Repeatable"; // eslint-disable-line import/no-cycle
import { createNewRepeatable } from "../../actions/repeatables";

const Repeatables = ({ addRepeatableTo, question, type }) => {
  const add = () => {
    addRepeatableTo(question.id);
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
            <Repeatable number={i + 1} question={q} type={type} />
          </AccordionItem>
        ))}
      </Accordion>

      <div className="section-footer">
        <h3 className="question-inner-header">
          Do you have another{type ? ` ${type}` : ""} in this list?
        </h3>

        <div className="ds-c-field__hint">Optional</div>
        <button
          onClick={add}
          type="button"
          className="add-objective ds-c-button ds-c-button--primary"
        >
          Add another{type && ` ${type}`}
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </>
  );
};
Repeatables.propTypes = {
  addRepeatableTo: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  type: PropTypes.oneOf([PropTypes.string, null]),
};
Repeatables.defaultProps = {
  type: null,
};

const mapDispatchToProps = { addRepeatableTo: createNewRepeatable };

const ConnectedRepeatables = connect(null, mapDispatchToProps)(Repeatables);

export { ConnectedRepeatables as Repeatables };
export default ConnectedRepeatables;
