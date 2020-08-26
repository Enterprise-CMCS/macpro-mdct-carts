import React, { Component } from "react";
import { connect } from "react-redux";
import CMSChoice from "./CMSChoice";
import { TextField, ChoiceList } from "@cmsgov/design-system-core";

import DateRange from "../layout/DateRange";
import CMSRanges from "./CMSRanges";
import { setAnswerEntry } from "../../actions/initial";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.validatePercentage = this.validatePercentage.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleCheckboxFlag = this.handleCheckboxFlag.bind(this);
    this.handleIntegerChange = this.handleIntegerChange.bind(this);
    this.updateLocalStateOnly = this.updateLocalStateOnly.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
  }

  validatePercentage(evt) {
    // Regex to allow only numbers and decimals
    const regex = new RegExp(
      "^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:.[0-9]{0,30})?$"
    );
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
    const validNumberRegex = RegExp("^(?:d{1,3}(?:,d{3})*|d+)(?:.d+)?$");
    if (evt.target.value.length > 0) {
      if (validNumberRegex.test(evt.target.value)) {
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

  // Limit to 10 digits or throw error
  validatePhone(evt) {
    // Remove hyphens
    let digits = evt.target.value.replace(/-/g, "");

    let errorMessage;
    if (digits.length > 10) {
      errorMessage = "Please limit to 10 digits";
    } else {
      errorMessage = null;
    }

    this.setState({
      [evt.target.name + "Err"]: errorMessage,
    });
  }

  handleCheckboxFlag(evt) {
    this.props.sectionContext([evt.target.name, evt.target.checked]);
  }

  handleChange(evt) {
    this.props.setAnswer(evt.target.name, evt);
    // this.props.sectionContext([evt.target.name, evt.target.value]);

    // this.setState({
    //   [evt.target.name]: evt.target.value ? evt.target.value : null,
    //   [evt.target.name + "Mod"]: true,
    // });
  }

  handleChangeArray(evtArray) {
    this.props.sectionContext([evtArray[0], evtArray[1]]);
    this.setState({
      [evtArray[0]]: evtArray[1] ? evtArray[1] : null,
      [evtArray[0] + "Mod"]: true,
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
  };

  render() {
    return (
      <>
        {this.props.data.map((question, index) => (
          <div className="question" key={index}>
            <fieldset className="ds-c-fieldset">
              {/* Generating question label */}
              <legend className="ds-c-label">
                {question.id
                  ? typeof question.id.substring(question.id.length - 2) ===
                    Number
                    ? parseInt(question.id.substring(question.id.length - 2))
                    : question.id.substring(question.id.length - 1) +
                      ". " +
                      question.label
                  : null}
              </legend>
              {question.type === "radio" || question.type === "checkbox"
                ? Object.entries(question.answer.options).map((key, index) => {
                    return (
                      <CMSChoice
                        name={question.id}
                        value={key[1]}
                        label={key[0]}
                        type={question.type}
                        answer={question.answer.entry}
                        conditional={question.conditional}
                        children={question.questions}
                        valueFromParent={this.state[question.id]}
                        onChange={this.handleChangeArray}
                        key={index}
                        sectionContext={this.props.sectionContext}
                      />
                    );
                  })
                : null}

              {/* If textarea */}
              {question.type === "text" ? (
                <TextField
                  multiple
                  name={question.id}
                  value={question.answer.entry || ''}
                  type="text"
                  onChange={this.handleChange}
                  label=""
                />
              ) : null}

              {/* Email  */}
              {question.type === "email" ? (
                <TextField
                  name={question.id}
                  value={
                    this.state[question.id] || this.state[question.id + "Mod"]
                      ? this.state[question.id]
                      : question.answer.entry
                  }
                  type="text"
                  label=""
                  onBlur={this.validateEmail}
                  onChange={this.updateLocalStateOnly}
                  errorMessage={
                    this.state[question.id + "Err"]
                      ? "Please enter a valid email address"
                      : false
                  }
                />
              ) : null}

              {/* If small textarea */}
              {question.type === "text_small" ? (
                <TextField
                  className="ds-c-input"
                  name={question.id}
                  value={question.answer.entry || ''}
                  type="text"
                  onChange={this.handleChange}
                  label=""
                />
              ) : null}

              {/* If medium textarea */}
              {question.type === "text_medium" ? (
                <div>
                  <TextField
                    className="ds-c-input"
                    multiline
                    name={question.id}
                    value={question.answer.entry || null}
                    type="text"
                    name={question.id}
                    rows={3}
                    onChange={this.handleChange}
                    label=""
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
                    value={question.answer.entry || ''}
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
                    label=""
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
                <TextField
                  className="phone_number"
                  label=""
                  numeric={true}
                  mask="phone"
                  pattern="[0-9]*"
                  value={question.answer.entry}
                  name={question.id}
                  onBlur={this.validatePhone}
                  errorMessage={
                    this.state[question.id + "Err"]
                      ? this.state[question.id + "Err"]
                      : null
                  }
                />
              ) : null}

              {question.type === "percentage" ? (
                <>
                  <TextField
                    className="percentage"
                    inputMode="percentage"
                    pattern="[0-9]*"
                    numeric={true}
                    name={question.id}
                    value={
                      this.state[question.id]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                    errorMessage={
                      this.state[question.id + "Err"]
                        ? this.state[question.id + "Err"]
                        : null
                    }
                    onChange={(this.handleChange, this.validatePercentage)}
                    label=""
                  />
                  <>%</>
                </>
              ) : null}

              {question.type === "checkbox_flag" ? (
                <ChoiceList
                  name={question.id}
                  choices={[
                    {
                      label: "Select",
                      defaultChecked: question.answer.entry,
                      value: "",
                    },
                  ]}
                  type="checkbox"
                  answer={question.answer.entry}
                  onChange={this.handleCheckboxFlag}
                  label=""
                />
              ) : null}
              {/*Children of radio and checkboxes are handled in their respective sections (above)*/}
              {question.questions &&
              question.type !== "fieldset" &&
              question.type !== "radio" &&
              question.type !== "checkbox" ? (
                <QuestionComponent
                  subquestion={true}
                  data={question.questions} //Array of subquestions to map through
                  sectionContext={this.props.sectionContext} // function binding children to parent context
                />
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

// "checkbox",[x]
// "file_upload",[x]
// "integer",[x]
// "money",[x]
// "percentage",  [x] [BOUND]
// "radio",[x]
// "ranges",[x]
// "text",[x] [BOUND] multiline not working?
// "text_medium",[x] [BOUND]
// "text_multiline",[x] [BOUND]
// "text_small"   [x] [BOUND]
// "phone_number", [x] [BOUND]
// "email", [x] [BOUND]
// "daterange", [x] [BOUND]
// "mailing_address",[x] [BOUND] [??? is this several fields?? is this a component???, just a multiline textbox ]

//TO-DO
// "checkbox_flag", [kindof like a 'accept terms and conditions' checkbox, just accepts an input]

const mapDispatchToProps = {
  setAnswer: setAnswerEntry
};

export default connect(null, mapDispatchToProps)(QuestionComponent);
