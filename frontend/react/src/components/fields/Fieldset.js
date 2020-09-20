import React from "react";
import PropTypes from "prop-types";

import Question from "./Question"; // eslint-disable-line import/no-cycle
import { SynthesizedTable } from "./SynthesizedTable";
import { SynthesizedValue } from "./SynthesizedValue";

// Not done:
// ==========================
// datagrid_with_total
// marked
// noninteractive_table
// unmarked_descendants

const Fieldset = ({ question, ...props }) => {
  switch (question.fieldset_type) {
    case "synthesized_table":
      return <SynthesizedTable question={question} {...props} />;
    case "synthesized_value":
      return <SynthesizedValue question={question} {...props} />;
    default:
      return question.questions.map((q) => (
        <Question key={q.id} question={q} {...props} />
      ));
  }
};
Fieldset.propTypes = {
  question: PropTypes.object.isRequired,
};

export { Fieldset };
export default Fieldset;
