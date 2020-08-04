import React from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";

export const CMSChoice = (props) => {
  // Determine if choice is checked
  const isChecked = props.answer === props.value ? "checked" : null;

  // Create children
  let fields = [];
  if (props.conditional === props.value && props.children) {
    props.children.map((item) => {
      switch (item.type) {
        case "text_long":
          fields.push(
            <>
              <textarea
                class="ds-c-field"
                name={item.id}
                value={item.answer.entry}
                type="text"
                name={item.id}
                rows="6"
              />
            </>
          );
          break;
        case "radio":
          Object.entries(item.answer.options).map(function (key, index) {
            const isCheckedChild =
              key[1] === item.answer.entry ? "checked" : null;
            return fields.push(
              <>
                {index === 0 ? (
                  <legend className="ds-c-label">{item.label}</legend>
                ) : null}
                <Choice
                  className="fpl-input"
                  name={item.id}
                  value={key[1]}
                  type="radio"
                  checked={isCheckedChild}
                >
                  {key[0]}
                </Choice>
              </>
            );
          });
          break;
        case "ranges":
          return fields.push(<FPL label={item.label} />);
          break;
        case "money":
          fields.push(
            <>
              <TextField
                className="fpl-input"
                label={item.label}
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
                value={item.answer.entry}
              />
            </>
          );
          break;
      }
    });
  }

  return (
    <>
      <Choice
        class="ds-c-choice"
        name={props.name}
        value={props.value}
        type={props.type}
        checked={isChecked}
        checkedChildren={
          <div className="ds-c-choice__checkedChild">{fields}</div>
        }
      >
        {props.label}
      </Choice>
    </>
  );
};
