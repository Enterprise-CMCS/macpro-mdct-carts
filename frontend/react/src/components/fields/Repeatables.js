import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionItem } from "@reach/accordion";

import { Repeatable } from "./Repeatable";
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
          Do you have another moop moop in this list?
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

const mapDispatchToProps = { addRepeatableTo: createNewRepeatable };

const ConnectedRepeatables = connect(null, mapDispatchToProps)(Repeatables);

export { ConnectedRepeatables as Repeatables };
