import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../layout/FPL";
import CMSChoice from "./CMSChoice";
import CMSLegend from "./CMSLegend";
import { TextField, Choice, ChoiceList } from "@cmsgov/design-system-core";
import NumberFormat from "react-number-format";

import {
  generateMoneyField,
  generateRangeField,
  generateRadioCheckField,
  generateTextLongField,
} from "../Utils/questionUtils";

import { shouldDisplay } from "../Utils/helperFunctions";
import DateRange from "../layout/DateRange";
import CMSRanges from "./CMSRanges";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.validatePercentage = this.validatePercentage.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleCheckboxFlag = this.handleCheckboxFlag.bind(this);
    this.handleIntegerChange = this.handleIntegerChange.bind(this);
    this.updateLocalStateOnly = this.updateLocalStateOnly.bind(this);
  }

  validatePercentage(evt) {
    // Regex to allow only numbers and decimals
    const regex = new RegExp("^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{0,30})?$");
    let error;
    // If content has been entered
    if (evt.target.value.length > 0) {

      // Test returns boolean
      if (!regex.test(evt.target.value)) {
        error = "Please enter only numbers and decimals";
      } else {
        error = null;
      }

    }

    // Write to local state
    this.setState({
      [evt.target.name + "Err"]: error,
    });
  }

  // For input that will be validated onBlur but need to update state onChange
  updateLocalStateOnly(evt) {
    this.setState({
      [evt.target.name]: evt.target.value ? evt.target.value : null,
      [evt.target.name + "Mod"]: true,
    });
  }

  handleIntegerChange(evt) {
    // let newNumber = NumberFormat.removeFormatting(evt.target.value);
    // console.log("what do you look like??", newNumber);
    // this.setState({
    //   [evt.target.name]: NumberFormat.removeFormatting(evt.target.value),
    // });
    // this.props.sectionContext([
    //   evt.target.name,
    //   NumberFormat.removeFormatting(evt.target.value),
    // ]);
    const validNumberRegex = RegExp("^(?:d{1,3}(?:,d{3})*|d+)(?:.d+)?$");
    if (evt.target.value.length > 0) {
      if (validNumberRegex.test(evt.target.value)) {
        // this.props.sectionContext([evt.target.name, evt.target.value]);
        // this.setState({
        //   [evt.target.name]: evt.target.value ? evt.target.value : null,
        //   [evt.target.name + "Mod"]: true,
        //   [evt.target.name + "Err"]: !validNumberRegex.test(evt.target.value),
        // });
      } else {
        this.setState({
          [evt.target.name + "Err"]: !validNumberRegex.test(evt.target.value),
        });
      }
    }
  }

  validateEmail(evt) {
    const validEmailRegex = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    );
    if (evt.target.value.length > 0) {
      if (validEmailRegex.test(evt.target.value)) {
        this.props.sectionContext([evt.target.name, evt.target.value]);
        this.setState({
          [evt.target.name]: evt.target.value ? evt.target.value : null,
          [evt.target.name + "Mod"]: true,
          [evt.target.name + "Err"]: !validEmailRegex.test(evt.target.value),
        });
      } else {
        this.setState({
          [evt.target.name + "Err"]: !validEmailRegex.test(evt.target.value),
        });
      }
    }
  }

  handleCheckboxFlag(evt) {
    this.props.sectionContext([evt.target.name, evt.target.checked]);
  }

  handleChange(evt) {
    this.props.sectionContext([evt.target.name, evt.target.value]);

    this.setState({
      [evt.target.name]: evt.target.value ? evt.target.value : null,
      [evt.target.name + "Mod"]: true,
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
                    value={
                      this.state[question.id] || this.state[question.id + "Mod"]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                    type="text"
                    onChange={this.handleChange}
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
                    onChange={this.updateLocalStateOnly}
                    errorMessage={
                      this.state[question.id + "Err"]
                        ? "Please enter a valid email address"
                        : false
                    }
                  />
                </div>
              ) : null}

              {/* If small textarea */}
              {question.type === "text_small" ? (
                <div>
                  <TextField
                    className="ds-c-input"
                    name={question.id}
                    value={
                      this.state[question.id] || this.state[question.id + "Mod"]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                    type="text"
                    onChange={this.handleChange}
                  />
                </div>
              ) : null}

              {/* If medium textarea */}
              {question.type === "text_medium" ? (
                <div>
                  <TextField
                    className="ds-c-input"
                    multiline
                    name={question.id}
                    value={
                      this.state[question.id] || this.state[question.id + "Mod"]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                    type="text"
                    name={question.id}
                    rows={3}
                    onChange={this.handleChange}
                  />
                </div>
              ) : null}

              {/* If large textarea */}
              {question.type === "text_multiline" ||
                question.type === "mailing_address" ? (
                  <div>
                    <TextField
                      label=""
                      className="ds-c-input"
                      multiline
                      value={
                        this.state[question.id] || this.state[question.id + "Mod"]
                          ? this.state[question.id]
                          : question.answer.entry
                      }
                      type="text"
                      name={question.id}
                      rows="6"
                      onChange={this.handleChange}
                    />
                  </div>
                ) : null}

              {/* If FPL Range */}
              {question.type === "ranges" ? (
                <CMSRanges
                  item={question}
                  sectionContext={this.props.sectionContext}
                />
              ) : null}

              {/* If integer*/}

              {/* 
              Allow commas && periods?? (ask erin/austin)
              if so:
              do we want that stripped out before saving to state? YES
              
              */}
              {/* {question.type === "integer" ? (
                <NumberFormat
                  name={question.id}
                  className="ds-c-input"
                  value={
                    this.state[question.id] || this.state[question.id + "Mod"]
                      ? this.state[question.id]
                      : question.answer.entry
                  }
                  onValueChange={this.handleIntegerChange}
                />
              ) : null} */}

              {question.type === "integer" ? (
                <TextField
                  name={question.id}
                  className="ds-c-input"
                  label=""
                  value={
                    this.state[question.id] || this.state[question.id + "Mod"]
                      ? this.state[question.id]
                      : question.answer.entry
                  }
                  onChange={this.handleIntegerChange}
                />
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
                    name={question.id}
                    value={question.answer.entry}
                    errorMessage={this.state[question.id + "Err"] ? this.state[question.id + "Err"] : null}
                    onChange={this.validatePercentage}
                    onBlur={this.handleChange}
                  />
                  <>%</>
                </>
              ) : null}

              {question.type === "checkbox_flag" ? (
                <>
                  <ChoiceList
                    name={question.id}
                    choices={[
                      {
                        label: "Select",
                        defaultChecked: question.answer.entry,
                      },
                    ]}
                    type="checkbox"
                    answer={question.answer.entry}
                    onChange={this.handleCheckboxFlag}
                  />
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
// "text",[x] [BOUND]
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
