import React from 'react';
import { QuestionInteger, getLabelFromFragment } from "./../sections/basicinfoapi/QuestionLike"
import { InputGrid } from "./../fields/InputGrid"

export const Fieldset = ({ fragment, changeFunc }) => {
  return (
    <fieldset>
      <legend className="part__legend">{fragment.label}</legend>
      {
        fragment.questions.map(question => {
          const type = question.fieldset_type;
          if (type === "marked") {  //TODO: Should know if I need to add `inputgrid` class once I know this question is marked.
            return (
              <>
                <label className="ds-c-label" >
                  {type === "marked" && getLabelFromFragment(question)}
                </label>
                <span className="ds-c-field__hint">
                  {question.hint}
                </span>
                {
                  question.questions.map(field => {
                    if (field.type === "integer") {
                      return <QuestionInteger fragment={field} changeFunc={changeFunc} marked={false} />//TODO: Please group a-f, making Total field part of the `datagrid` type.
                    }
                    else if (field.fieldset_type === "datagrid") {
                      return <InputGrid fragment={field.questions} /> //TODO: Need to know earlier that this is a datagrid.
                    }
                    else return field.type;
                  })
                }
              </>
            )
          }
          else return <span className="ds-u-color--error">unmarked: {type}</span>
        })
      }
    </fieldset>
  )
}
