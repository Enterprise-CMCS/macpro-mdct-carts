import React, { useState } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";

// this.state{
//   fields: null
// }
// childFields = this.state.fields;

export const CMSChoice = (props) => {
  const [childFields, setChildFields] = useState({ field: [] });

  // Determine if choice is checked
  const isChecked = props.answer === props.value ? "checked" : null;

  // Create children
  let field;
  if (props.conditional === props.value && props.children) {
    props.children.map((item) => {
      switch (item.answer_type) {
        case "money":
          field = (
            <>
              {item.id}
              <TextField
                className="fpl-input"
                label={item.text}
                inputMode="currency"
                mask="currency"
                pattern="[0-9]*"
              />
            </>
          );
          // console.log("Field: ", field);
          console.log("Type of: ", childFields.field);
          let test = childFields.field;
          test.push(field);
          // setChildFields(test);
          break;
        case "multi":
          field = item.answer_values.map((answer, index) => (
            // <fieldset className="ds-c-fieldset">
            //   <legend className="ds-c-label">{item.text}</legend>
            <Choice className="fpl-input" name={item.id} value={answer}>
              {answer} {item.id}
            </Choice>
            // </fieldset>
          ));
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
        type="radio"
        checked={isChecked}
        checkedChildren={<div>{childFields.fields}</div>}
      >
        {props.value}
      </Choice>
    </>
  );
};
