import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";
import { v4 as uuidv4 } from "uuid";

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
          <Question key={q.id || uuidv4()} question={q} printView={printView} />
        ))}
      </AccordionPanel>
    </>
  );
};
Repeatable.propTypes = {
  headerRef: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  type: PropTypes.string,
  printView: PropTypes.bool,
};

Repeatable.defaultProps = {
  type: null,
};

export { Repeatable };
export default Repeatable;
