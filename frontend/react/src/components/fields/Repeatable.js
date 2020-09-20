import React from "react";
import PropTypes from "prop-types";
import { AccordionButton, AccordionPanel } from "@reach/accordion";

import Question from "./Question"; // eslint-disable-line import/no-cycle

const Repeatable = ({ number, question, type }) => {
  const children = question.questions ? question.questions : [];

  const title = type ? `${type} ${number}` : `${number}`;

  return (
    <>
      <div className="accordion-header">
        <h3>
          <AccordionButton>
            <div className="accordion-title">{title}</div>
          </AccordionButton>
        </h3>
      </div>
      <AccordionPanel>
        {children.map((q) => (
          <Question key={q.id} question={q} />
        ))}
      </AccordionPanel>
    </>
  );
};
Repeatable.propTypes = {
  number: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  type: PropTypes.oneOf([PropTypes.string, null]),
};

Repeatable.defaultProps = {
  type: null,
};

export { Repeatable };
export default Repeatable;
