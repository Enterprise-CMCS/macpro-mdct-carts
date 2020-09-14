import React from "react";
import { TextField } from "@cmsgov/design-system-core";

const InputGrid = ({ questions, changeFunc, withTotal }) => {
  const rowStyle =
    questions.questions.length > 5
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;
  const total = questions.questions[0];
  const group = questions.questions.slice(1);
  return (
    <>
      <div className={`ds-l-row input-grid__total ${rowStyle}`}>
        <div className="ds-l-col">
          {/* Replace with Integer component */}
          <TextField
            className="ds-c-input total"
            label={total.label}
            name={total.id}
            numeric
            onChange={changeFunc}
            value={(total.answer && total.answer.entry) || ""}
          />
        </div>
      </div>
      <div className={`ds-l-row input-grid__group ${rowStyle}`}>
        {group.map((input) => {
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
    </>
  );
};

export default InputGrid;
