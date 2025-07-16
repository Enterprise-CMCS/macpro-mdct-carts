import React from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import DataGrid from "./DataGrid";
import SynthesizedTable from "./SynthesizedTable";
import { NoninteractiveTable } from "./NoninteractiveTable";
import SynthesizedValue from "./SynthesizedValue";

/*
 * Not done:
 * ==========================
 * datagrid_with_total
 * marked
 * unmarked_descendants
 */

const Fieldset = ({ question, ...props }) => {
  switch (question.fieldset_type) {
    case "datagrid":
      return <DataGrid question={question} {...props} />;
    case "synthesized_table":
      return <SynthesizedTable question={question} {...props} />;
    case "synthesized_value":
      return <SynthesizedValue question={question} {...props} />;
    case "noninteractive_table":
      return <NoninteractiveTable question={question} {...props} />;
    default:
      return question.questions.map((q, index) => (
        <Question key={q.id || index} question={q} {...props} />
      ));
  }
};
Fieldset.propTypes = {
  question: PropTypes.object.isRequired,
};

export { Fieldset };
export default Fieldset;
