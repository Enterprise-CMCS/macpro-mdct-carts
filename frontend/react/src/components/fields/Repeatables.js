import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem } from "@reach/accordion";

import { Repeatable } from "./Repeatable"; // eslint-disable-line import/no-cycle
import {
  createNewRepeatable,
  removeRepeatable,
} from "../../actions/repeatables";

const Repeatables = ({
  addRepeatableTo,
  disabled,
  question,
  removeRepeatableFrom,
  type,
}) => {
  const ref = useRef();

  const add = () => {
    addRepeatableTo(question.id);

    // Do the focus+scroll on the next UI tick so the DOM will have updated
    // before we try to grab DOM elements.
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        ref.current.scrollIntoView();
      }
    }, 10);
  };

  const remove = () => {
    removeRepeatableFrom(question.id);
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
            <Repeatable
              headerRef={ref}
              number={i + 1}
              question={q}
              type={question.typeLabel ? question.typeLabel : type}
            />
          </AccordionItem>
        ))}

        {question.questions.length > 1 && (
          <button
            disabled={disabled}
            onClick={remove}
            type="button"
            className="add-objective ds-c-button ds-c-button--danger"
          >
            Delete last {type || "item"}
          </button>
        )}
      </Accordion>

      <div className="section-footer">
        <h3 className="question-inner-header">
          Do you have another{type ? ` ${type}` : ""} in this list?
        </h3>

        <div className="ds-c-field__hint">Optional</div>
        <button
          disabled={disabled}
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
  disabled: PropTypes.bool.isRequired,
  question: PropTypes.object.isRequired,
  removeRepeatableFrom: PropTypes.func.isRequired,
  type: PropTypes.oneOf([PropTypes.string, null]),
};
Repeatables.defaultProps = {
  type: null,
};

const mapDispatchToProps = {
  addRepeatableTo: createNewRepeatable,
  removeRepeatableFrom: removeRepeatable,
};

const ConnectedRepeatables = connect(null, mapDispatchToProps)(Repeatables);

export { ConnectedRepeatables as Repeatables };
export default ConnectedRepeatables;
