import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";

import Question from "./Question";

const Repeatable = ({ headerRef, number, question, type, printView }) => {
  const children = question.questions ? question.questions : [];

  const title = type ? `${type} ${number}` : `${number}`;

  return (
    <>
      <div className="accordion-header" ref={headerRef}>
        <span className="span-pdf-no-bookmark">
          <AccordionButton>
            <div className="accordion-title">{title}</div>
          </AccordionButton>
        </span>
      </div>
      <AccordionPanel>
        {children.map((q) => (
          <Question key={q.id} question={q} printView={printView} />
        ))}
      </AccordionPanel>
    </>
  );
};
Repeatable.propTypes = {
  headerRef: PropTypes.func.isRequired,
  number: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  type: PropTypes.oneOf([PropTypes.string, null]),
  printView: PropTypes.bool,
};

Repeatable.defaultProps = {
  type: null,
};

export { Repeatable };
export default Repeatable;
