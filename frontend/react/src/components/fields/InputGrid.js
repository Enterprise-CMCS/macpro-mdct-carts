import React from "react";
import { connect } from "react-redux";
import { selectFragment } from "./../../store/formData";
import { TextField } from "@cmsgov/design-system-core";

const InputGrid = ({ questions, changeFunc, ...props }) => {
  const rowStyle =
    questions.questions.length > 5
      ? `subquestion ds-u-padding-left--2`
      : `ds-u-margin-top--0`;
  const total = questions.questions[0];
  const group = questions.questions.slice(1);
  const initial = 0;

  const totalReducer = (acc, item) => {
    if (item.answer) {
      return acc + parseInt(item.answer.entry);
    } else return 0;
  };
  const totalSum = group.reduce(totalReducer, initial);

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
            value={totalSum || 0} // or sum of the group fields
            disabled
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
