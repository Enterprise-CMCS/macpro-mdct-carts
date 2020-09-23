import React, { Component } from "react";
import { connect } from "react-redux";
import CMSChoice from "./CMSChoice";
import CMSLegend from "./CMSLegend";
import { Alert, TextField, ChoiceList } from "@cmsgov/design-system-core";
import DateRange from "../layout/DateRange";
import CMSRanges from "./CMSRanges";
import { setAnswerEntry } from "../../actions/initial";
import { selectQuestionsForPart, selectQuestion } from "../../store/selectors";

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
    this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
    this.buildSynthesizedValue = this.buildSynthesizedValue.bind(this);
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
        this.props.setAnswer(evt.target.name, evt.target.value);
      }
    }

    // Write to local state
    this.setState({
      [evt.target.name + "Err"]: error,
    });
  }

  // For input that will be validated onBlur but needs to update state onChange
  updateLocalStateOnly(evt) {
    const value = evt.target.value ? evt.target.value : [];
    this.setState({
      [evt.target.name]: value,
    });
  }

  handleIntegerChange(evt) {
    const validNumberRegex = RegExp(/^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/);

    if (evt.target.value.length > 0) {
      if (validNumberRegex.test(evt.target.value)) {
        let formattedNum = evt.target.value.replace(/[ ,]/g, "");
        this.props.setAnswer(evt.target.name, formattedNum);
        this.setState({
          [evt.target.name]: evt.target.value ? evt.target.value : null,

          [evt.target.name + "Err"]: validNumberRegex.test(evt.target.value),
        });
      } else {
        this.setState({
          [evt.target.name + "Err"]: validNumberRegex.test(evt.target.value),
        });
      }
    } else {
      this.props.setAnswer(evt.target.name, evt.target.value);
    }
  }

  validateEmail(evt) {
    const validEmailRegex = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    );
    if (evt.target.value.length > 0) {
      if (validEmailRegex.test(evt.target.value)) {
        this.props.setAnswer(evt.target.name, evt.target.value);
        this.setState({
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

      this.props.setAnswer(evt.target.name, digits);
    }

    this.setState({
      [evt.target.name + "Err"]: errorMessage,
    });
  }

  handleCheckboxInput(evtArr) {
    // An array of the checkbox items already selected, or an empty array
    let selections = this.state[evtArr[0]] ?? [];

    // If the current choice is already in state, find it's index in that array
    // returns -1 if the choice isnt in the selections array
    let alreadySelected = selections.indexOf(evtArr[1]);

    // if its already there and it is being selected again, remove it
    if (alreadySelected !== -1) {
      selections.splice(alreadySelected, 1);
    } else {
      // if its not in the array of selections, add it
      selections.push(evtArr[1]);
    }

    this.setState({ [evtArr[0]]: [...selections] });

    this.props.setAnswer([evtArr[0]], selections);
  }

  handleCheckboxFlag(evt) {
    this.props.setAnswer(evt.target.name, evt.target.checked);
  }

  handleChange(evt) {
    this.props.setAnswer(evt.target.name, evt.target.value);
  }

  handleChangeArray(evtArray) {
    this.props.setAnswer(evtArray[0], evtArray[1]);
    this.setState({
      [evtArray[0]]: evtArray[1] ? evtArray[1] : null,
      [evtArray[0] + "Mod"]: true,
    });
  }

  handleFileUpload(event) {
    this.props.setAnswer(event.target.name, event.target.files);
  }

  buildSynthesizedValue = (question) => {
    const numerator = selectQuestion(
      this.props.store,
      question.fieldset_info.targets[0].split("'")[1]
    );
    const denominator = selectQuestion(
      this.props.store,
      question.fieldset_info.targets[1].split("'")[1]
    );
    return numerator.answer.entry && denominator.answer.entry
      ? numerator.answer.entry / denominator.answer.entry
      : "";
  };
  render() {
    return (
      <>
        {this.props.data.map((question, index) => (
          <div className="question" key={index}>
            <fieldset className="ds-c-fieldset">
              {/* Generating question label */}
              <legend className="ds-c-label">
                <CMSLegend id={question.id} label={question.label} />
              </legend>
              {question.type === "radio"
                ? question.answer.options.map(({ label, value }, index) => {
                    return (
                      <CMSChoice
                        name={question.id}
                        value={value}
                        label={label}
                        hint={question.hint}
                        type={question.type}
                        answer={question.answer.entry}
                        conditional={question.conditional}
                        children={question.questions}
                        valueFromParent={this.state[question.id]}
                        onChange={this.handleChangeArray}
                        key={index}
                        setAnswer={this.props.setAnswer}
                        disabled={question.answer.readonly}
                        disabledFromParent={question.answer.readonly}
                      />
                    );
                  })
                : null}

              {question.type === "checkbox"
                ? question.answer.options.map(({ label, value }, index) => {
                    return (
                      <CMSChoice
                        name={question.id}
                        value={value}
                        label={label}
                        hint={question.hint}
                        type={question.type}
                        answer={question.answer.entry}
                        conditional={question.conditional}
                        children={question.questions}
                        valueFromParent={this.state[question.id]}
                        onChange={this.handleCheckboxInput}
                        key={index}
                        setAnswer={this.props.setAnswer}
                        disabled={question.answer.readonly}
                      />
                    );
                  })
                : null}

              {/* If textarea */}
              {question.type === "text" ? (
                <TextField
                  multiple
                  name={question.id}
                  value={question.answer.entry || ""}
                  type="text"
                  onChange={this.handleChange}
                  label=""
                  hint={question.hint}
                  disabled={question.answer.readonly}
                />
              ) : null}

              {/* Email  */}
              {question.type === "email" ? (
                <TextField
                  name={question.id}
                  value={
                    this.state[question.id]
                      ? this.state[question.id]
                      : question.answer.entry
                  }
                  type="text"
                  label=""
                  hint={question.hint}
                  onBlur={this.validateEmail}
                  onChange={this.updateLocalStateOnly}
                  errorMessage={
                    this.state[question.id + "Err"]
                      ? "Please enter a valid email address"
                      : false
                  }
                  disabled={question.answer.readonly}
                />
              ) : null}

              {/* If small textarea */}
              {question.type === "text_small" ? (
                <TextField
                  className="ds-c-input"
                  label=""
                  hint={question.hint}
                  name={question.id}
                  onChange={this.handleChange}
                  type="text"
                  value={question.answer.entry || ""}
                  disabled={question.answer.readonly}
                />
              ) : null}

              {/* If medium textarea */}
              {question.type === "text_medium" ? (
                <div>
                  <TextField
                    className="ds-c-input"
                    label=""
                    hint={question.hint}
                    multiline
                    name={question.id}
                    onChange={this.handleChange}
                    rows={3}
                    type="text"
                    value={question.answer.entry || ""}
                    disabled={question.answer.readonly}
                  />
                </div>
              ) : null}

              {/* If large textarea */}
              {question.type === "text_multiline" ||
              question.type === "mailing_address" ? (
                <div>
                  <TextField
                    className="ds-c-input"
                    label=""
                    hint={question.hint}
                    multiline
                    name={question.id}
                    onChange={this.handleChange}
                    rows={6}
                    type="text"
                    value={question.answer.entry || ""}
                    disabled={question.answer.readonly}
                  />
                </div>
              ) : null}

              {/* If FPL Range */}
              {question.type === "ranges" ? (
                <CMSRanges item={question} onChange={this.handleChangeArray} />
              ) : null}

              {/* If integer*/}
              {question.type === "integer" ? (
                <TextField
                  className="ds-c-input"
                  errorMessage={
                    this.state[question.id + "Err"] === false
                      ? "Please enter numbers only"
                      : false
                  }
                  label=""
                  hint={question.hint}
                  name={question.id}
                  numeric
                  onChange={this.handleIntegerChange}
                  value={question.answer.entry || ""}
                />
              ) : null}

              {/* If file upload */}
              {question.type === "file_upload" ? (
                <div>
                  <TextField
                    className="file_upload"
                    label=""
                    hint={question.hint}
                    multiple
                    name={question.id}
                    onChange={this.handleFileUpload}
                    type="file"
                    value={
                      this.state[question.id] || this.state[question.id + "Mod"]
                        ? this.state[question.id]
                        : question.answer.entry
                    }
                  />
                </div>
              ) : null}

              {/* If money */}
              {question.type === "money" ? (
                <>
                  <TextField
                    className="money"
                    errorMessage={
                      this.state[question.id + "Err"] === false
                        ? "Please enter numbers only"
                        : false
                    }
                    inputMode="currency"
                    label=""
                    hint={question.hint}
                    mask="currency"
                    name={question.id}
                    numeric
                    onChange={this.handleIntegerChange}
                    pattern="[0-9]*"
                    value={question.answer.entry || ""}
                    disabled={question.answer.readonly}
                  />
                </>
              ) : null}

              {/* If Date range */}

              {question.type === "daterange" ? (
                <DateRange
                  question={question}
                  onChange={this.handleChangeArray}
                />
              ) : null}

              {question.type === "phone_number" ? (
                <TextField
                  className="phone_number"
                  errorMessage={
                    this.state[question.id + "Err"]
                      ? this.state[question.id + "Err"]
                      : null
                  }
                  label=""
                  hint={question.hint}
                  mask="phone"
                  name={question.id}
                  numeric={true}
                  onBlur={this.validatePhone}
                  pattern="[0-9]*"
                  value={question.answer.entry || ""}
                  disabled={question.answer.readonly}
                />
              ) : null}

              {question.type === "percentage" ? (
                <>
                  <TextField
                    className="percentage"
                    errorMessage={
                      this.state[question.id + "Err"]
                        ? this.state[question.id + "Err"]
                        : null
                    }
                    inputMode="percentage"
                    label=""
                    hint={question.hint}
                    name={question.id}
                    numeric={true}
                    onChange={this.validatePercentage}
                    pattern="[0-9]*"
                    value={question.answer.entry || ""}
                    disabled={question.answer.readonly}
                  />
                  <>%</>
                </>
              ) : null}

              {question.type === "checkbox_flag" ? (
                <ChoiceList
                  choices={[
                    {
                      label: "Select",
                      defaultChecked: question.answer.entry,
                      value: "",
                    },
                  ]}
                  label=""
                  hint={question.hint}
                  name={question.id}
                  onChange={this.handleCheckboxFlag}
                  type="checkbox"
                  value={question.answer.entry || ""}
                />
              ) : null}

              {question.type === "fieldset" &&
              question.fieldset_type === "noninteractive_table" ? (
                <table className="ds-c-table" width="100%">
                  <thead>
                    <tr>
                      {question.fieldset_info.headers.map(function (value) {
                        return (
                          <th
                            width={`${
                              100 / question.fieldset_info.headers.length
                            }%`}
                            name={`${value}`}
                          >
                            {value}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  {question.fieldset_info.rows.map((value) => {
                    return (
                      <tr>
                        {value.map((value) => {
                          return (
                            <td
                              width={`${
                                100 / question.fieldset_info.headers.length
                              }%`}
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </table>
              ) : null}
              {question.type === "fieldset" &&
              question.fieldset_type === "synthesized_value" ? (
                <>
                  <TextField
                    name={question.id}
                    className="ds-c-input"
                    label={"Rate (Auto-calculated)"}
                    value={this.buildSynthesizedValue(question)}
                  />
                </>
              ) : null}

              {/*Children of radio and checkboxes are handled in their respective sections (above)*/}
              {question.questions &&
              question.type !== "fieldset" &&
              question.type !== "radio" &&
              question.type !== "checkbox" ? (
                <QuestionComponent
                  subquestion={true}
                  setAnswer={this.props.setAnswer}
                  data={question.questions} //Array of subquestions to map through
                />
              ) : null}
              {/*Below is required for 2b #3-6 */}
              {question.questions && question.type === "fieldset" ? (
                <div className="cmsfieldset">
                  {question.label ? <h3>{question.label}</h3> : null}
                  {
                    <QuestionComponent
                      subquestion={true}
                      setAnswer={this.props.setAnswer}
                      data={question.questions} //Array of subquestions to map through
                    />
                  }
                </div>
              ) : null}
              {question.questions &&
                question.type === "fieldset" &&
                question.context_data &&
                (question.context_data.skip_text ? (
                  <Alert>
                    <p className="ds-c-alert__text">
                      {question.context_data.skip_text}
                    </p>
                  </Alert>
                ) : (
                  <div className="cmsfieldset">
                    {
                      <QuestionComponent
                        subquestion={true}
                        setAnswer={this.props.setAnswer}
                        data={question.questions}
                      />
                    }
                  </div>
                ))}
            </fieldset>
          </div>
        ))}
      </>
    );
  }
}

// "checkbox"        <<831
// "file_upload"   needs component
// "integer"         <<831
// "money"             <<831
// "percentage"      <<831
// "radio"          <<831
// "ranges"         <<831
// "text"            <<831
// "text_medium"         <<831
// "text_multiline"         <<831
// "text_small"         <<831
// "phone_number"         <<831
// "email"                <<831
// "daterange"             <<831
// "mailing_address"         <<831

const mapStateToProps = (state, { data, partId }) => ({
  data: data || selectQuestionsForPart(state, partId),
  store: state,
});

const mapDispatchToProps = {
  setAnswer: setAnswerEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionComponent);
