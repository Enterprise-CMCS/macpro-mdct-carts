import React from "react";
import { TextField } from "@cmsgov/design-system-core";

const InputGrid = ({ questions, changeFunc }) => {
  return (
    <div className="input-grid">
      <div className="ds-l-row input-grid__groups ds-u-margin-top--0">
        {questions.questions.map((input) => {
          return input.type === "integer" ? (
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
          ) : (
            input.type
          );
        })}
      </div>
    </div>
  );
};

export default InputGrid;
