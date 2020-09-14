import React from "react";
import { TextField } from "@cmsgov/design-system-core";

const InputGrid = ({ questions, changeFunc }) => {
  console.log("questions=>", questions.questions);
  const questionStyle =
    questions.questions.length > 4
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;

  return (
    <div className={`ds-l-row input-grid__groups ${questionStyle}`}>
      {questions.questions.map((input) => {
        return (
          input.type === "integer" && (
            <div className="ds-l-col">
              {/* Replace with Integer component */}
              <TextField
                className="ds-c-input"
                label={input.label}
                name={input.id}
                numeric
                onChange={changeFunc}
                value={(input.answer && input.answer.entry) || ""}
              />
            </div>
          )
        );
      })}
    </div>
  );
};

export default InputGrid;
