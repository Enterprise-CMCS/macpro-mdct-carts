import React from "react";
import Question from "../layout/Question";
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
  }

  return question.questions.map((q) => (
    <Question key={q.id} question={q} {...props} />
  ));
};

export { Fieldset };
