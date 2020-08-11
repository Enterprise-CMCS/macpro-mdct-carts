import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import Data from "./../backend-json-section-2.json";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";

class Questions2A extends Component {
  constructor(props) {
    super(props);

    this.state = { temp: "Here is the original stuff" };

    this.handleChange = this.handleChange.bind(this);
  }
  // Get state program (temporary; will be set by API)

  handleChange(evt) {
    console.log("Handle Change occured", evt);
    this.setState({
      temp: "This has been changed",
      [evt[0]]: evt[1],
    });
  }

  render() {
    const stateProgram = "medicaid_exp_chip";
    let rowCount = 0;
    let createChoices;
    return (
      < form >
        {/* Begin parsing through subsection */}
        {
          Data.section.subsections.map((subsections) => (
            <div className="section">
              {/* Begin parsing through parts */}
              {subsections.parts.map((part) => (
                <div className="part">
                  {part.title ?
                    (<h3 className="part-title">{part.title}</h3>)
                    : null}
                  {/* Determine if question should be shown */}
                  {part.questions.map((question) => (
                    <div className="question">
                      <fieldset className="ds-c-fieldset">
                        {question.label}
                        {question.type === "radio" || question.type === "checkbox"
                          ? Object.entries(question.answer.options).map((
                            key,
                            index
                          ) => {
                            return (
                              <CMSChoice
                                name={question.id}
                                value={key[1]}
                                label={key[0]}
                                type={question.type}
                                onChange={this.handleChange}
                                answer={question.answer.entry}
                                conditional={question.conditional}
                                children={question.questions}
                              />
                            );
                          })
                          : null}
                        {question.type === "fieldset" && question.fieldset_type === "noninteractive_table"
                          ? Object.entries(question.fieldset_info).map((value) => {
                            return (
                              <table className="ds-c-table" width="100%">
                                {(value[0] === "headers") ? (
                                  <thead>
                                    <tr>
                                      {question.fieldset_info.headers.map(function (value) {
                                        return (
                                          <th width={`${100 / question.fieldset_info.headers.length}%`} name={`${value}`}>
                                            {value}
                                          </th>
                                        )
                                      })}
                                    </tr>
                                  </thead>
                                ) : null}
                                {(value[0] === "rows") ? (
                                  question.fieldset_info.rows.map((value) => {
                                    return (
                                      <tr>
                                        {value.map((value) => {
                                          return (
                                            <td width={`${100 / question.fieldset_info.headers.length}%`}>{value}</td>
                                          )
                                        })
                                        }
                                      </tr>
                                    )
                                  })
                                ) : null}
                              </table>
                            );
                          })
                          : null}
                        {/* If textarea */}
                        {question.type === "text_long" ? (
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
                        ) : null}
                        {/* If FPL Range */}
                        {question.type === "ranges" ? (
                          <div>
                            <FPL label={question.label} />
                          </div>
                        ) : null}
                      </fieldset>
                    </div>
                  ))
                  }
                </div>
              ))}
            </div>
          ))
        }
      </form >
    )
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions2A);
