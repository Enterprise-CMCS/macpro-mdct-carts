import React from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";

let childFields = [];
export const CMSChoice = (props) => {
  // Determine if choice is checked
  const isChecked = props.answer === props.value ? "checked" : null;

  // Create children
  if (props.conditional === props.value && props.children) {
    props.children.map((item) => {
      switch (item.answer_type) {
        case "money":
          childFields.push(
            <TextField
              className="fpl-input"
              label={item.text}
              inputMode="currency"
              mask="currency"
              pattern="[0-9]*"
            />
          );
          break;
        case "multi":
          // "skip_text": "This question doesn’t apply to your state since you answered NO to Question 2.",
          // "text": "Are your premium fees tiered by Federal Poverty Level (FPL)?",
          // "answer_type": "multi",
          // "answer_values": ["yes", "no"],
          // "answer": null
          //   childFields += item.answer_values.length;
          childFields = item.answer_values.map((answer) => (
            // <fieldset className="ds-c-fieldset">
            //   <legend className="ds-c-label">{item.text}</legend>
            <Choice className="fpl-input" name={item.id} value={answer}>
              {answer}
            </Choice>
            // </fieldset>
          ));
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
        checkedChildren={childFields}
      >
        {props.value}
      </Choice>
    </>
  );
};
