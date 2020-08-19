import React, { Component } from "react";
import { connect } from "react-redux";
// import Data from "../backend-json-section-3.json";
import FPL from "../layout/FPL";
import CMSChoice from "./CMSChoice";
import CMSLegend from "./CMSLegend";
import { TextField, Choice } from "@cmsgov/design-system-core";

import {
  generateMoneyField,
  generateRangeField,
  generateRadioCheckField,
  generateTextLongField,
} from "../Utils/questionUtils";

import { shouldDisplay } from "../Utils/helperFunctions";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.validatePercentage = this.validatePercentage.bind(this);
  }

  validatePercentage(evt) {
    // Take in evt.target.value
    // parseInt(evt.target.value).toFixed(2)
    // Needs to be added to state so state value can be validated

    // placeholder
    return true;
  }

  handleChange(evtArr) {
    this.props.sectionContext(evtArr);
    this.setState({
      [evtArr[0]]: evtArr[1],
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
  };

  render() {
    let input;
    return (
      <>
        {this.props.data.map((question) => (
          <div className="question">
            <fieldset className="ds-c-fieldset">
              {/* Generating question label */}

              <CMSLegend
                label={question.label}
                id={question.id}
                type={this.props.subquestion ? "subquestion" : null}
              />

              {question.type === "radio" || question.type === "checkbox"
                ? Object.entries(question.answer.options).map((key, index) => {
                    return (
                      <CMSChoice
                        name={question.id}
                        value={key[1]}
                        label={key[0]}
                        type={question.type}
                        answer={question.answer.entry} // JSON Answer
                        children={question.questions}
                        valueFromParent={this.state[question.id]} // User selection in local state
                        sectionContext={this.props.sectionContext}
                      />
                    );
                  })
                : null}
              {/* If textarea */}
              {question.type === "text" ? (
                <div>
                  <TextField
                    className="ds-c-field"
                    multiple
                    name={question.id}
                    value={question.answer.entry}
                    type="text"
                    name={question.id}
                    // onChange={this.props.sectionContext("some value")}
                  />
                </div>
              ) : null}

              {/* If small textarea */}
              {question.type === "text_small" ? (
                <div>
                  <TextField
                    className="ds-c-field"
                    multiple
                    name={question.id}
                    value={question.answer.entry}
                    type="text"
                    name={question.id}
                    size="small"
                    // onChange={this.props.sectionContext("some value")}
                  />
                </div>
              ) : null}

              {/* If medium textarea */}
              {question.type === "text_medium" ? (
                <div>
                  <TextField
                    className="ds-c-field"
                    multiple
                    name={question.id}
                    value={question.answer.entry}
                    type="text"
                    name={question.id}
                    size="medium"
                    // onChange={this.props.sectionContext("some value")}
                  />
                </div>
              ) : null}

              {/* If large textarea */}
              {question.type === "text_multiline" ? (
                <div>
                  <TextField
                    className="ds-c-field"
                    multiple
                    name={question.id}
                    value={question.answer.entry}
                    type="text"
                    name={question.id}
                    rows="6"
                    // onChange={this.props.sectionContext("some value")}
                  />
                </div>
              ) : null}

              {/* If FPL Range */}
              {question.type === "ranges" ? (
                <div>
                  <FPL label={question.label} />
                </div>
              ) : null}
              {question.type === "integer" ? (
                <div>
                  <TextField
                    // label={question.label}
                    className="ds-u-margin-top--0"
                    name="integer"
                    multiple
                  />
                </div>
              ) : null}
              {/* If FPL Range */}
              {question.type === "file_upload" ? (
                <div>
                  <TextField
                    // label={question.label}
                    className="file_upload"
                    onChange={this.handleFileUpload}
                    name="fileUpload"
                    type="file"
                    multiple
                  />
                </div>
              ) : null}
              {question.type === "money" ? (
                <>
                  <TextField
                    className="money"
                    // label={item.label}
                    inputMode="currency"
                    mask="currency"
                    pattern="[0-9]*"
                    value={question.answer.entry}
                  />
                </>
              ) : null}

              {question.type === "phone_number" ? (
                <>
                  <TextField
                    className="phone_number"
                    // label={item.label}
                    numeric={true}
                    mask="phone"
                    pattern="[0-9]*"
                    value={question.answer.entry}
                  />
                </>
              ) : null}

              {question.type === "percentage" ? (
                <>
                  <TextField
                    className="percentage"
                    inputMode="percentage"
                    pattern="[0-9]*"
                    numeric={true}
                    value={question.answer.entry}
                    onChange={this.validatePercentage}
                  />
                  <>%</>
                </>
              ) : null}

              {question.questions && question.type !== "fieldset" ? (
                <div>
                  {
                    <QuestionComponent
                      subquestion={true}
                      data={question.questions} //Array of subquestions to map through
                      sectionContext={this.props.sectionContext} // function binding children to parent context
                    />
                  }
                </div>
              ) : null}

              {question.questions && question.type === "fieldset" ? (
                <div className="cmsfieldset">
                  {
                    <QuestionComponent
                      subquestion={true}
                      data={question.questions} //Array of subquestions to map through
                      sectionContext={this.props.sectionContext} // function binding children to parent context
                    />
                  }
                </div>
              ) : null}
            </fieldset>
          </div>
        ))}
      </>
    );
  }
}

// anticipated question types
// for ones that are unclear, put a textfield with 'PLACEHOLDER'

// "checkbox",[x]
// "file_upload",[x]
// "integer",[x]
// "money",[x]
// "percentage",  [x]
// "phone_number", [x]
// "radio",[x]
// "ranges",[x]
// "text",[x]
// "text_medium",[x]
// "text_multiline",[x]
// "text_small"   [x]
// "daterange", [*** Will take from new CMSRanges component ***]

// "objectives", [???]
// "checkbox_flag", [????]
// "email", [??? validation??]
// "mailing_address", [??? is this several fields?? is this a component??? ]

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  section3FData: state.section3.questionData.section3FData,
});

export default connect(mapStateToProps)(QuestionComponent);
