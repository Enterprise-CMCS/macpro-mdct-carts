import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion } from "@cmsgov/design-system";

import { Repeatable } from "./Repeatable";
import {
  createNewRepeatable,
  removeRepeatable,
} from "../../actions/repeatables";

const Repeatables = ({
  addRepeatableTo,
  disabled,
  question,
  removeRepeatableFrom,
  type = null,
  printView,
}) => {
  const add = () => {
    addRepeatableTo(question.id);
  };

  const remove = () => {
    removeRepeatableFrom(question.id);
  };

  let doYouHaveAnotherVerbiage;
  if (question.addAnotherText) {
    doYouHaveAnotherVerbiage = question.addAnotherText;
  } else if (question.typeLabel) {
    doYouHaveAnotherVerbiage = `Do you have another ${question.typeLabel} in this list?`;
  } else {
    doYouHaveAnotherVerbiage = `Do you have another in this list?`;
  }

  return (
    <>
      <Accordion>
        {question.questions.map((q, i) => (
          <Repeatable
            key={q.id}
            number={i + 1}
            question={q}
            type={question.typeLabel ? question.typeLabel : type}
            printView={printView}
          />
        ))}

        {question.questions.length > 1 && (
          <button
            disabled={disabled}
            onClick={remove}
            type="button"
            className="delete-repeatable ds-c-button ds-c-button--danger"
          >
            Delete last {question.typeLabel || "item"}
          </button>
        )}
      </Accordion>

      <div className="section-footer">
        <span className="question-inner-header span-pdf-no-bookmark">
          {doYouHaveAnotherVerbiage}
        </span>

        {!question.hideOptionalHint && (
          <div className="ds-c-field__hint" aria-label="Hint">
            Optional
          </div>
        )}
        <button
          disabled={disabled}
          onClick={add}
          type="button"
          className="add-objective ds-c-button ds-c-button--solid"
        >
          Add another{question.typeLabel && ` ${question.typeLabel}`}
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </>
  );
};
Repeatables.propTypes = {
  addRepeatableTo: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  question: PropTypes.object.isRequired,
  removeRepeatableFrom: PropTypes.func.isRequired,
  type: PropTypes.string,
  printView: PropTypes.bool,
};

const mapDispatchToProps = {
  addRepeatableTo: createNewRepeatable,
  removeRepeatableFrom: removeRepeatable,
};

const ConnectedRepeatables = connect(null, mapDispatchToProps)(Repeatables);

export { ConnectedRepeatables as Repeatables };
export default ConnectedRepeatables;
