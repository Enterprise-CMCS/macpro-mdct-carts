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
import DateRange from "../layout/DateRange";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.validatePercentage = this.validatePercentage.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  validatePercentage(evt) {
    // Take in evt.target.value
    // parseInt(evt.target.value).toFixed(2)
    // Needs to be added to state so state value can be validated

    // placeholder
    return true;
  }

  validateEmail(evt) {
    const validEmailRegex = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    );
    if (evt.target.value.length > 0) {
      this.setState({
        [evt.target.name + "Err"]: !validEmailRegex.test(evt.target.value),
      });
    }
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value ? evt.target.value : null,
      [evt.target.name + "Mod"]: true,
    });

    this.props.sectionContext(["questionid", "some value"]);
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
                    value={question.answer.entry}
                    type="text"
                    name={question.id}
                    rows="6"
                    // onChange={this.props.sectionContext("some value")}
                  />
                </div>
              ) : null}

              {/* If mailing address */}
              {question.type === "mailing_address" ? (
                <div>
                  <TextField
                    className="ds-c-field"
                    multiple
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

              {/* Email  */}
              {question.type === "email" ? (
                <div>
                  <TextField
                    name={question.id}
                    value={
                      this.state[question.id] || this.state[question.id + "Mod"]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                    type="text"
                    onBlur={this.validateEmail}
                    onChange={this.handleChange}
                    errorMessage={
                      this.state[question.id + "Err"]
                        ? "Please enter a valid email address"
                        : false
                    }
                  />
                </div>
              ) : null}

              {/* If file upload */}
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

              {/* If money */}
              {question.type === "money" ? (
                <>
                  <TextField
                    className="money"
                    label=""
                    inputMode="currency"
                    mask="currency"
                    pattern="[0-9]*"
                    value={question.answer.entry}
                  />
                </>
              ) : null}

              {/* If Date range */}
              {question.type === "daterange" ? (
                <DateRange
                  question={question}
                  sectionContext={this.props.sectionContext} // function binding children to parent context
                />
              ) : null}

              {question.type === "phone_number" ? (
                <>
                  <TextField
                    className="phone_number"
                    label=""
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
// "radio",[x]
// "ranges",[x]
// "text",[x]
// "text_medium",[x]
// "text_multiline",[x]
// "text_small"   [x]
// "phone_number", [x]
// "email", [x]
// "daterange", [x]
// "mailing_address", [??? is this several fields?? is this a component???, just a multiline textbox ]

//TO-DO
// "checkbox_flag", [kindof like a 'accept terms and conditions' checkbox, just accepts an input]

// "objectives", [??? foggedaboutit]

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  section3FData: state.section3.questionData.section3FData,
});

export default connect(mapStateToProps)(QuestionComponent);
