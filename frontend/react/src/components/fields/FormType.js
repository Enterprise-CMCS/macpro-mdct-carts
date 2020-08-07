import React from "react";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import FPL from "./../layout/FPL";
import CMSChoice from "./../fields/CMSChoice";
import CMSLegend from "./../fields/CMSLegend";


//FIXME: create named export to avoid ??? 
export const FormType = question => {
  switch (question.type) {
    case "text_short":
      return "some tiny text"
      break
    case "text_long":
      return (
        <div>
          <textarea
            class="ds-c-field"
            name={question.id}
            value={question.answer.entry}
            type="text"
            name={question.id}
            rows="6"
          />
        </div>
      )
      break
    case "radio":
      return (
        Object.entries(question.answer.options).map(
          (key, index) => {
            return (
              <CMSChoice
                name={question.id}
                value={key[1]}
                label={key[0]}
                type={question.type}
                answer={question.answer.entry}
                conditional={question.conditional}
                children={question.questions}
              // valueFromParent={this.state[question.id]}
              // onChange={this.handleChange}
              />
            );
          }
        )
      )
      break
    case "ranges":
      return (
        <div>
          {/* Refactor into Range component - github #250 */}
          <FPL label={question.label} />
        </div>
      )
      break
    default:
      return question.type
      break
  }
}