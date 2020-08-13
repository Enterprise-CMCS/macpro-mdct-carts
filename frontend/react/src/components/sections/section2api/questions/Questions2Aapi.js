import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import Data from "./../backend-json-section-2.json";
import CMSLegend from "../../../fields/CMSLegend";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import QuestionComponent from "../../../fields/QuestionComponent";

class Questions2A extends Component {
  constructor(props) {
    super(props);

    this.state = { temp: "Here is the original stuff" };

    this.handleChange = this.handleChange.bind(this);
    this.bindToParentContext = this.bindToParentContext.bind(this);
  }
  // Get state program (temporary; will be set by API)
  bindToParentContext(evtArr) {
    this.setState({
      parentHasBeenChanged: this.state.parentHasBeenChanged + 1,
      lastChangedBy: evtArr[0],
      [evtArr[0]]: evtArr[1],
    });
  }

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
              {subsections.id === "2020-02-a" ?
                <>
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
                            <CMSLegend
                              label={question.label}
                              id={question.id}
                              type="question"
                            />
                            {question.type === "radio" || question.type === "checkbox"
                              ? Object.entries(question.answer.options).map((
                                key,
                                index
                              ) => {
                                return (
                                  <>
                                    {question.id === "2020-02-a-03" ? (//JSON was altered here. Child of a-03 is fieldset. Children of fieldset now have context_data
                                      <CMSChoice
                                        name={question.id}
                                        value={key[1]}
                                        label={key[0]}
                                        type={question.type}
                                        onChange={this.handleChange}
                                        answer={question.answer.entry}
                                        conditional={question.conditional}
                                        children={question.questions[0].questions}
                                        valueFromParent={this.state[question.id]}
                                      />)
                                      : <CMSChoice
                                        name={question.id}
                                        value={key[1]}
                                        label={key[0]}
                                        type={question.type}
                                        onChange={this.handleChange}
                                        answer={question.answer.entry}
                                        conditional={question.conditional}
                                        children={question.questions}
                                        valueFromParent={this.state[question.id]}
                                      />}
                                  </>
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
                            {question.type === "fieldset" ?
                              <></>
                              : null}
                            {/* If textarea */}
                            {question.type === "text_multiline" ? (
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
                </> : null}
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
