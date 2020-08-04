import React, { useState } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";

// this.state{
//   fields: null
// }
// childFields = this.state.fields;

export const CMSChoice = (props) => {
  const [childFields, setChildFields] = useState({ field: [] });

  // Determine if choice is checked
  const isChecked = props.answer === props.value ? "checked" : null;

  // Create children
  let field = [];
  if (props.conditional === props.value && props.children) {
    props.children.map((item) => {
      switch (item.type) {
        case "text_long":
          field.push(
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
          // console.log("Field: ", field);
          console.log("Type of: ", childFields.field);
          let test = childFields.field;
          test.push(field);
          // setChildFields(test);
          break;
        case "radio":
          Object.entries(item.answer.options).map(function (key, index) {
            return field.push(
              <>
                {index === 0 ? (
                  <legend className="ds-c-label">{item.label}</legend>
                ) : null}
                <Choice
                  className="fpl-input"
                  name={item.id}
                  value={key[1]}
                  type="radio"
                >
                  {key[0]}
                </Choice>
              </>
            );
          });
          break;
        case "ranges":
          return field.push(<FPL label={item.label} />);
          break;
        case "money":
          field.push(
            <>
              <TextField
                className="fpl-input"
                label={item.label}
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
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
          <div className="ds-c-choice__checkedChild">{field}</div>
        }
      >
        {props.label}
      </Choice>
    </>
  );
};
