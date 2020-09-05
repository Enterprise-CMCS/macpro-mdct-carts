import React from "react";
import Question from "../layout/Question";

const Fieldset = ({ question, ...props }) => (
  <>
    {question.questions.map((q) => (
      <Question key={q.id} question={q} {...props} />
    ))}
  </>
);

export { Fieldset };
