import React from "react"
import { QuestionInteger } from "./../sections/basicinfoapi/QuestionLike"

export const InputGrid = ({ fragment }) => {
  return (
    <div className={"input-grid"}>
      <div className="ds-l-row input-grid__groups ds-u-margin-top--0">
        {
          fragment.map(field => {
            if (field.type === "integer") {
              return (
                <div className="ds-l-col">
                  <QuestionInteger fragment={field} marked={false} />
                </div>
              )
            }
            else if (field.type === "fieldset") { // Again, with the fieldset.
              return (
                <div className="input-grid ds-u-padding--2 subquestion">
                  <QuestionInteger fragment={field} marked={true} />
                </div>
              )
            }
            else return null;
          })
        }
      </div>
    </div>
  )
}
