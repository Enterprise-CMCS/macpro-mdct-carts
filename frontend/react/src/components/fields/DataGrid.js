import React from "react";
import PropTypes from "prop-types";
import Question from "./Question"; // eslint-disable-line import/no-cycle

export const DataGrid = ({ question }) => {
  const rowStyle =
    question.questions.length > 5
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;

  const total = question.questions
    .filter((q) => q.answer)
    .reduce((sum, { answer: { entry } }) => sum + +entry, 0);

  return (
    <div className={`ds-l-row input-grid__group ${rowStyle}`}>
      {question.questions.map((input) => (
        <div className="ds-l-col">
          <Question question={input} />
        </div>
      ))}
    </div>
  );

  // return <pre>{JSON.stringify(question, null, 2)}</pre>;
};

DataGrid.propTypes = {
  question: PropTypes.object.isRequired,
};

export default DataGrid;
