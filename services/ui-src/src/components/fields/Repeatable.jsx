import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AccordionItem } from "@cmsgov/design-system";

import Question from "./Question";

const Repeatable = ({ number, question, type = null, printView }) => {
  const children = question.questions ?? [];

  const title = type ? `${type} ${number}` : `${number}`;
 // add wrapper ref to set attribute on the accordion button in print view
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (printView && wrapperRef.current) {
      const button = wrapperRef.current.querySelector(".ds-c-accordion__button");
      button?.setAttribute("aria-disabled", "true");
    }
  }, [printView]);

  return (
    <div ref={wrapperRef}>
      <AccordionItem
        defaultOpen
        heading={title}
        isControlledOpen={printView ? true : undefined}
        headingLevel="3"
        closeIcon={<span aria-hidden="true">–</span>}
        openIcon={<span aria-hidden="true">+</span>}
      >
        <div className="ds-c-choice__checkedChild ds-u-padding-top--0 ds-u-display--flex">
          <div className="question-container">
            {children.map((q, index) => (
              <Question
                key={q.id || index}
                question={q}
                printView={printView}
              />
            ))}
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};
Repeatable.propTypes = {
  number: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  type: PropTypes.string,
  printView: PropTypes.bool,
};

export { Repeatable };
export default Repeatable;
