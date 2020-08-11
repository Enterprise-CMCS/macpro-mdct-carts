import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import FPL from "../../../layout/FPL";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";

class Questions1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      p1_q1: "",
      p1_q1__a: "",
      p1_q2: "",
      p1_q2__a: "",
      p1_q2__a__1: "",
      p1_q3: "",
      p1_q3__b: "",
      p1_q4: "",
      p1_q4__a: "",
      p1_q5: "",
      p1_q6: "",
      p2_q1: "",
      p2_q1__a: "",
      p2_q2: "",
      p2_q2__a: "",
      p2_q2__a__1: "",
      p2_q3: "",
      p2_q4: "",
      p2_q4__a: "",
      p2_q5: "",
      p2_q6: "",
      p3_q1: "",
      p3_q2: "",
      p3_q3: "",
      p3_q4: "",
      p3_q5: "",
      ly_p1_q1: "yes",
      ly_p1_q1__a: "100.00",
      ly_p1_q2: "yes",
      ly_p1_q2__a: "no",
      ly_p1_q2__a__1: "50.00",
      ly_p1_q3: "no",
      l1_p1_q3__b: "",
      ly_p1_q4: "",
      ly_p1_q4__a: "",
      ly_p1_q5: "Managed Care Organization (MCO)",
      ly_p1_q6: "This is what you wrote last year.",
      ly_p2_q1: "no",
      ly_p2_q1__a: "",
      ly_p2_q2: "no",
      ly_p2_q2__a: "",
      ly_p2_q2__a__1: "",
      ly_p2_q3: "",
      ly_p2_q4: "",
      ly_p2_q4__a: "",
      ly_p2_q5: "Primary Care Case Management (PCCM)",
      ly_p2_q6: "This is what you wrote last year.",

      fillFormTitle: "Same as last year",

      mchipDisable: false,
      schipDisable: false,
      p1q2Disable: true,
      p2q2Disable: true,

      p3_yes: [],
      p4_yes: [],
      ly_p3_yes: [],
      ly_p4_yes: [],

      // Initialize FPL ranges
      p1_q2_fpl: [],
      p1_q2_fpl_count: 1,

      p1_q3_fpl: [],
      p1_q3_fpl_count: 1,

      p2_q2_fpl: [],
      p2_q2_fpl_count: 1,

      p2_q3_fpl: [],
      p2_q3_fpl_count: 1,
    };

    this.setConditional = this.setConditional.bind(this);
    this.setProgramDisable = this.setProgramDisable(this);
    this.setQuestionDisable = this.setQuestionDisable.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
    this.newFPL = this.newFPL.bind(this);
  }

  componentDidMount() {
    // Set initial component for FPL ranges
    const initialFPL = [
      {
        id: 1,
        component: (
          <FPL
            fieldLabels={[
              ["FPL starts at", "FPL ends at"],
              ["Premium fee starts at", "Premium fee ends at"],
            ]}
          />
        ),
      },
    ];

    this.setState({
      p1_q2_fpl: initialFPL,
      p1_q3_fpl: initialFPL,
      p2_q2_fpl: initialFPL,
      p2_q3_fpl: initialFPL,
    });
  }

  /**
   * Add new FPL component to list (state) and update state
   *
   * @param {String} list
   */
  newFPL(list) {
    let newID = this.state[list + "_count"] + 1;
    console.log("newID: ", newID);
    let newFPL = {
      id: newID,
      component: (
        <FPL
          fieldLabels={[
            ["FPL starts at", "FPL ends at"],
            ["Premium fee starts at", "Premium fee ends at"],
          ]}
        />
      ),
    };
    this.setState({
      [`${list}_count`]: newID,
      [`${list}`]: this.state[list].concat(newFPL),
    });
  }
  /**
   * Add/remove keyword from display array
   *
   * @param {String} part
   * @param {Element} el
   */
  setKeyword(part, el) {
    let name = el.target.name;
    let p3Yes = this.state.p3_yes;
    let p4Yes = this.state.p4_yes;

    // If answer is yes, add name
    if (el.target.value === "yes") {
      if (part === "p3") {
        this.setState({
          p3_yes: this.state.p3_yes.concat(name),
        });
      } else {
        this.setState({
          p4_yes: this.state.p4_yes.concat(name),
        });
      }
      // If answer is NOT yes, remove name from array
    } else {
      if (part === "p3") {
        // Find array index based on value
        let index = p3Yes.indexOf(name);

        // Remove array item by index id
        if (index !== -1) {
          p3Yes.splice(index, 1);
        }

        // Reset state with new array
        this.setState({ p3_yes: p3Yes });
      } else {
        // Find array index based on value
        let index = p4Yes.indexOf(name);

        // Remove array item by index id
        if (index !== -1) p4Yes.splice(index, 1);

        // Reset state with new array
        this.setState({ p4_yes: p4Yes });
      }
    }
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    // el.target.defaultChecked = true;
    this.setQuestionDisable(el.target.name, el.target.value);
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setProgramDisable() {
    {
      this.props.programType === "mCHIP"
        ? (this.state.mchipDisable = true)
        : (this.statemchipDisable = false);
    }
    {
      this.props.programType === "sCHIP"
        ? (this.state.schipDisable = true)
        : (this.stateschipDisable = false);
    }
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setQuestionDisable(ename, evalue) {
    //Each question must have its own disable variable in state
    //The disable variable should only be changed IF we are working with the appropriate question
    if (ename === "p1_q2") {
      evalue === "yes"
        ? this.setState({ p1q2Disable: false })
        : this.setState({ p1q2Disable: true });
    }
    if (ename === "p2_q2") {
      evalue === "yes"
        ? this.setState({ p2q2Disable: false })
        : this.setState({ p2q2Disable: true });
    }
  }

  render() {
    return (
      <form>
        {this.setProgramDisable}
        {this.setQuestionDisable}
        <div>
          <h3 className="part-header">
            Part 1: S-CHIP Enrollment and Premium Fees
          </h3>
          {this.state.mchipDisable === true ? (
            <div className="ds-c-alert ds-c-alert--hide-icon">
              <div className="ds-c-alert__body">
                <h3 className="ds-c-alert__heading">
                  This part only applies to states with a S-CHIP program.
                </h3>
                <p className="ds-c-alert__text">Skip to Part 2.</p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="part1-all-questions-container"
            hidden={this.state.mchipDisable}
          >
            <div className="question-container">
              <div id="p1_q1">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    1. Does your program charge an enrollment fee?
                  </legend>
                  <Choice
                    name="p1_q1"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q1 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="a) How much is your enrollment fee?"
                            name="p1_q1__a"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p1_q1__a
                                : this.state.p1_q1__a
                            }
                            mask="currency"
                          />
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p1_q1"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q1 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p1_q2">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    2. Does your program charge a premium fee?
                  </legend>
                  <Choice
                    name="p1_q2"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q2 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                              a) Are your premium fees tiered by Federal Poverty
                              Level (FPL)?
                            </legend>
                            <Choice
                              name="p1_q2__a"
                              type="radio"
                              value="yes"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p1_q2__a === "yes"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                              checkedChildren={
                                <fieldset className="ds-c-fieldset ds-u-margin-top--1">
                                  <legend className="ds-c-label">
                                    b) Indicate the premium fee ranges and
                                    corresponding FPL ranges.
                                  </legend>
                                  {this.state.p1_q2_fpl.map((element) => (
                                    <div>{element.component}</div>
                                  ))}
                                  <button
                                    onClick={(e) => this.newFPL("p1_q2_fpl")}
                                    type="button"
                                    className="ds-c-button ds-c-button--primary"
                                  >
                                    Add another fee?
                                    <FontAwesomeIcon icon={faPlus} />
                                  </button>
                                </fieldset>
                              }
                            >
                              Yes
                            </Choice>
                            <Choice
                              name="p1_q2__a"
                              type="radio"
                              value="no"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p1_q2__a === "no"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                              checkedChildren={
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label"></legend>
                                  <TextField
                                    label="c) How much is your premium fee?"
                                    name="p1_q2__a__1"
                                    value={
                                      this.props.previousEntry === "true"
                                        ? this.state.ly_p1_q2__a__1
                                        : this.state.p1_q2__a__1
                                    }
                                    mask="currency"
                                    onChange={this.setConditional}
                                  />
                                </fieldset>
                              }
                            >
                              No
                            </Choice>
                            <Choice
                              name="p1_q2__a"
                              type="radio"
                              value="na"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p1_q2__a === "na"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                            >
                              N/A
                            </Choice>
                          </fieldset>
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p1_q2"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q2 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            {/* If the user has not responded to Q2, show the following alert message */}
            {this.state.p1q2Disable === true && this.state.p1_q2 === "" ? (
              <div className="ds-c-alert ds-c-alert--hide-icon">
                <div className="ds-c-alert__body">
                  <h3 className="ds-c-alert__heading">
                    Questions 3-4 may not apply to your state.
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* If the user responded No to Q2, show the following alert message */}
            {this.state.p1q2Disable === true && this.state.p1_q2 != "" ? (
              <div className="ds-c-alert ds-c-alert--hide-icon">
                <div className="ds-c-alert__body">
                  <h3 className="ds-c-alert__heading">
                    Questions 3-4 skipped based on your answers to previous
                    questions.
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* If the user responded Yes to Q2, show Q3-4 */}
            <div className="question-container">
              <div id="p1_q3" hidden={this.state.p1q2Disable}>
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    3. Is the maximum premium fee a family would be charged each
                    year tiered by FPL?
                  </legend>
                  <Choice
                    name="p1_q3"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q3 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                              a) Indicate the premium fee ranges and
                              corresponding FPL ranges Max family premium fees
                              tiered by FPL
                            </legend>
                            {this.state.p1_q3_fpl.map((element) => (
                              <div>{element.component}</div>
                            ))}
                            <button
                              onClick={(e) => this.newFPL("p1_q3_fpl")}
                              type="button"
                              className="ds-c-button ds-c-button--primary"
                            >
                              Add another fee?
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </fieldset>
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p1_q3"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q3 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="b) What’s the maximum premium fee a family would be charged each year?"
                            name="p1_q3__b"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p1_q3__b
                                : this.state.p1_q3__b
                            }
                            mask="currency"
                            onChange={this.setConditional}
                          />
                        }
                      </div>
                    }
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p1_q4" hidden={this.state.p1q2Disable}>
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    4. Do your premium fees differ for different CHIP
                    populations beyond FPL (for example, by age)?
                  </legend>
                  <Choice
                    name="p1_q4"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q4 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="a) Please briefly explain the fee structure breakdown."
                            multiline
                            name="p1_q4__a"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p1_q4__a
                                : this.state.p1_q4__a
                            }
                            rows="6"
                            onChange={this.setConditional}
                          />
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p1_q4"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q4 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p1_q5">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    5. Which delivery system(s) do you use?
                  </legend>
                  <hint>Select all that apply.</hint>
                  <Choice
                    name="p1_q5"
                    value="Managed Care Organization (MCO)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q5 ===
                          "Managed Care Organization (MCO)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Managed Care Organization (MCO)
                  </Choice>
                  <Choice
                    name="p1_q5"
                    value="Primary Care Case Management (PCCM)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q1 ===
                          "Primary Care Case Management (PCCM)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Primary Care Case Management (PCCM)
                  </Choice>
                  <Choice
                    name="p1_q5"
                    value="Fee for Service (FFS)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q1 === "Fee for Service (FFS)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Fee for Service (FFS)
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p1_q6">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    6. Which delivery system(s) are available to which CHIP
                    populations? Indicate whether eligibility status, income
                    level, age range, or other criteria determine which delivery
                    system a population receives.
                  </legend>
                  <TextField
                    label=""
                    multiline
                    name="p1_q6"
                    value={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p1_q6
                        : this.state.p1_q6
                    }
                    rows="6"
                    onChange={this.setConditional}
                  />
                </fieldset>
              </div>
            </div>
          </div>

          <h3 className="part-header">
            Part 2: M-CHIP Enrollment and Premium Fees
          </h3>
          {/* If the State is S-CHIP only Program Type, show this alert */}
          {this.state.schipDisable === true ? (
            <div className="ds-c-alert ds-c-alert--hide-icon">
              <div className="ds-c-alert__body">
                <h3 className="ds-c-alert__heading">
                  This part only applies to states with a M-CHIP program.
                </h3>
                <p className="ds-c-alert__text">Skip to Part 3.</p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="part2-all-questions-container"
            hidden={this.state.schipDisable}
          >
            <div className="question-container">
              <div id="p2_q1">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    1. Does your program charge an enrollment fee?
                  </legend>
                  <Choice
                    name="p2_q1"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q1 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="a) How much is your enrollment fee?"
                            name="p2_q1__a"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p2_q1__a
                                : this.state.p2_q1__a
                            }
                            mask="currency"
                          />
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p2_q1"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q1 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p2_q2">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    2. Does your program charge a premium fee?
                  </legend>
                  <Choice
                    name="p2_q2"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q2 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                              a) Are your premium fees tiered by Federal Poverty
                              Level (FPL)?
                            </legend>
                            <Choice
                              name="p2_q2__a"
                              type="radio"
                              value="yes"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p2_q2__a === "yes"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                              checkedChildren={
                                <fieldset className="ds-c-fieldset ds-u-margin-top--1">
                                  <legend className="ds-c-label">
                                    b) Indicate the premium fee ranges and
                                    corresponding FPL ranges.
                                  </legend>
                                  {this.state.p2_q2_fpl.map((element) => (
                                    <div>{element.component}</div>
                                  ))}
                                  <button
                                    onClick={(e) => this.newFPL("p2_q2_fpl")}
                                    type="button"
                                    className="ds-c-button ds-c-button--primary"
                                  >
                                    Add another fee?
                                    <FontAwesomeIcon icon={faPlus} />
                                  </button>
                                </fieldset>
                              }
                            >
                              Yes
                            </Choice>
                            <Choice
                              name="p2_q2__a"
                              type="radio"
                              value="no"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p2_q2__a === "no"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                              checkedChildren={
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label"></legend>
                                  <TextField
                                    label="c) How much is your premium fee?"
                                    name="p2_q2__a__1"
                                    value={
                                      this.props.previousEntry === "true"
                                        ? this.state.ly_p2_q2__a__1
                                        : this.state.p2_q2__a__1
                                    }
                                    mask="currency"
                                    onChange={this.setConditional}
                                  />
                                </fieldset>
                              }
                            >
                              No
                            </Choice>
                            <Choice
                              name="p2_q2__a"
                              type="radio"
                              value="na"
                              defaultChecked={
                                this.props.previousEntry === "true"
                                  ? this.state.ly_p2_q2__a === "na"
                                    ? true
                                    : false
                                  : false
                              }
                              onChange={this.setConditional}
                            >
                              N/A
                            </Choice>
                          </fieldset>
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p2_q2"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q2 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>

            {/* If the user has not answered Q2 yet, show the alert below. */}
            {this.state.p2q2Disable === true && this.state.p2_q2 === "" ? (
              <div className="ds-c-alert ds-c-alert--hide-icon">
                <div className="ds-c-alert__body">
                  <h3 className="ds-c-alert__heading">
                    Questions 3-4 may not apply to your state.
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* If the user answered No to Q2, show the alert below. */}
            {this.state.p2q2Disable === true && this.state.p2_q2 != "" ? (
              <div className="ds-c-alert ds-c-alert--hide-icon">
                <div className="ds-c-alert__body">
                  <h3 className="ds-c-alert__heading">
                    Questions 3-4 skipped based on your answers to previous
                    questions.
                  </h3>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* If the user responded Yes to Q2, show Q3-4 */}
            <div className="question-container">
              <div id="p2_q3" hidden={this.state.p2q2Disable}>
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    3. Is the maximum premium fee a family would be charged each
                    year tiered by FPL?
                  </legend>
                  <Choice
                    name="p2_q3"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q3 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                              a) Indicate the premium fee ranges and
                              corresponding FPL ranges Max family premium fees
                              tiered by FPL
                            </legend>
                            {this.state.p2_q3_fpl.map((element) => (
                              <div>{element.component}</div>
                            ))}
                            <button
                              onClick={(e) => this.newFPL("p2_q3_fpl")}
                              type="button"
                              className="ds-c-button ds-c-button--primary"
                            >
                              Add another fee?
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </fieldset>
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p2_q3"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q3 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="b) What’s the maximum premium fee a family would be charged each year?"
                            name="p2_q3__b"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p2_q3__b
                                : this.state.p2_q3__b
                            }
                            mask="currency"
                            onChange={this.setConditional}
                          />
                        }
                      </div>
                    }
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p2_q4" hidden={this.state.p2q2Disable}>
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    4. Do your premium fees differ for different CHIP
                    populations beyond FPL (for example, by age)?
                  </legend>
                  <Choice
                    name="p2_q4"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q4 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                    checkedChildren={
                      <div className="ds-c-choice__checkedChild">
                        {
                          <TextField
                            label="a) Please briefly explain the fee structure breakdown."
                            multiline
                            name="p2_q4__a"
                            value={
                              this.props.previousEntry === "true"
                                ? this.state.ly_p2_q4__a
                                : this.state.p2_q4__a
                            }
                            rows="6"
                            onChange={this.setConditional}
                          />
                        }
                      </div>
                    }
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p2_q4"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q4 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p2_q5">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    5. Which delivery system(s) do you use?
                  </legend>
                  <hint>Select all that apply.</hint>
                  <Choice
                    name="p2_q5"
                    value="Managed Care Organization (MCO)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q5 ===
                          "Managed Care Organization (MCO)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Managed Care Organization (MCO)
                  </Choice>
                  <Choice
                    name="p2_q5"
                    value="Primary Care Case Management (PCCM)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q5 ===
                          "Primary Care Case Management (PCCM)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Primary Care Case Management (PCCM)
                  </Choice>
                  <Choice
                    name="p2_q5"
                    value="Fee for Service (FFS)"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q5 === "Fee for Service (FFS)"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Fee for Service (FFS)
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p2_q6">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    6. Which delivery system(s) are available to which CHIP
                    populations? Indicate whether eligibility status, income
                    level, age range, or other criteria determine which delivery
                    system a population receives.
                  </legend>
                  <TextField
                    label=""
                    multiline
                    name="p2_q6"
                    value={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p2_q6
                        : this.state.p2_q6
                    }
                    rows="6"
                    onChange={this.setConditional}
                  />
                </fieldset>
              </div>
            </div>
          </div>

          <h3 className="part-header">
            Part 3: S-CHIP Changes in Programs and Policies
          </h3>
          {this.state.mchipDisable === true ? (
            <div className="ds-c-alert ds-c-alert--hide-icon">
              <div className="ds-c-alert__body">
                <h3 className="ds-c-alert__heading">
                  This part only applies to states with a S-CHIP program.
                </h3>
                <p className="ds-c-alert__text">Skip to Part 4.</p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="part3-all-questions-container"
            hidden={this.state.mchipDisable}
          >
            <p>
              Indicate any changes you’ve made to your S-CHIP programs and
              policies in the past federal fiscal year. All changes require a
              State Plan Amendment (SPA).{" "}
            </p>
            <div className="question-container">
              <div id="p3_q1">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    1. Have you made any changes to the eligibility
                    determination process?
                  </legend>
                  <Choice
                    name="p3_q1"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q1 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q1"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q1 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q1"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q1 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p3_q2">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    2. Have you made any changes to the eligibility
                    redetermination process?
                  </legend>
                  <Choice
                    name="p3_q2"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q2 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q2"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q2 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q2"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q2 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p3_q3">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    3. Have you made any changes to the eligibility levels or
                    target populations?
                  </legend>
                  {
                    //<ChoiceList hint="For example: increasing the FPL or income levels, or other eligibility criteria."/>
                  }
                  <Choice
                    name="p3_q3"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q3 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q3"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q3 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q3"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q3 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p3_q4">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    4. Have you made any changes to the benefits available to
                    enrollees?
                  </legend>
                  {
                    //<ChoiceList hint="For example: adding or removing different types of coverage."/>
                  }
                  <Choice
                    name="p3_q4"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q4 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q4"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q4 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q4"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q4 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p3_q5">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    5. Have you made any changes to the single streamlined
                    application?
                  </legend>
                  <Choice
                    name="p3_q5"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q5 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q5"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q5 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q5"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q5 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
              <br />
              <div className="question-container">
                <div id="p3_q6">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      6. Have you made any changes to your outreach efforts?
                    </legend>
                    {
                      //<ChoiceList hint="For example: allotting more or less funding for outreach, or changing your target population."/>
                    }
                    <Choice
                      name="p3_q6"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q6 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q6"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q6 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q6"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q6 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q7">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      7. Have you made any changes to the delivery system(s)?
                    </legend>
                    {
                      //<ChoiceList hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."/>
                    }
                    <Choice
                      name="p3_q7"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q7 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q7"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q7 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q7"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q7 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q8">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      8. Have you made any changes to cost-sharing requirements?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing amounts, populations, or the collection process."/>
                    }
                    <Choice
                      name="p3_q8"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q8 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q8"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q8 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q8"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q8 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q9">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      9. Have you made any changes to the crowd-out policies?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing substitutions or the waiting periods."/>
                    }
                    <Choice
                      name="p3_q9"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q9 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q9"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q9 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q9"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q9 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q10">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      10. Have you made any changes to an enrollment freeze
                      and/or enrollment cap?
                    </legend>
                    <Choice
                      name="p3_q10"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q10 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q10"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q10 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q10"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q10 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q11">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      11. Have you made any changes to the enrollment process
                      for health plan selection?
                    </legend>
                    <Choice
                      name="p3_q11"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q11 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q11"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q11 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q11"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q11 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q12">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      12. Have you made any changes to the protections for
                      applicants and enrollees?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing from the Medicaid Fair Hearing Process to state law."/>
                    }
                    <Choice
                      name="p3_q12"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q12 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q12"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q12 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q12"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q12 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q13">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      13. Have you made any changes to premium assistance?
                    </legend>
                    {
                      //<ChoiceList hint="For example: adding premium assistance or changing the population that receives premium assistance."/>
                    }
                    <Choice
                      name="p3_q13"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q13 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q13"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q13 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q13"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q13 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q14">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      14. Have you made any changes to the methods and
                      procedures for preventing, investigating, or referring
                      fraud or abuse cases?
                    </legend>
                    <Choice
                      name="p3_q14"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q14 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q14"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q14 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q14"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q14 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q15">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      15. Have you made any changes to your prenatal care
                      eligibility?
                    </legend>
                    {
                      //<ChoiceList hint="For example: expanding eligibility to pregnant enrollees."/>
                    }
                    <Choice
                      name="p3_q!5"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q15 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q15"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q2 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q15"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q15 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q16">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      16. Have you made any changes to your Pregnant Woman State
                      Plan expansion?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p3_q16"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q16 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q16"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q16 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q16"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q16 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q17">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      17. Have you made any changes to eligibility for “lawfully
                      residing pregnant women”?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p3_q17"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q17 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q17"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q17 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q17"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q17 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q18">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      18. Have you made any changes to eligibility for “lawfully
                      residing children”?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p3_q18"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q18 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q18"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q18 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q18"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q18 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q19">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      19. Have you made any changes to any other program areas?
                    </legend>
                    <Choice
                      name="p3_q19"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q19 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p3_q19"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q19 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p3_q19"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p3_q19 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p3_q20">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      20. Anything else you’d like to add that wasn’t already
                      covered?
                    </legend>
                    <TextField label="" multiline name="p3_q20" rows="6" />
                  </fieldset>
                </div>
              </div>
              {this.state.p3_yes.length > 0 ? (
                <div className="part3-yes">
                  <h3>
                    Do you plan to submit a SPA (State Plan Amendment) to
                    reflect these changes if you haven’t done so already?
                  </h3>
                  <Choice
                    name="p3_q21"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q21 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p3_q21"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q21 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p3_q21"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p3_q21 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                  <ul>
                    {this.state.p3_yes.sort().map((current, index) => (
                      <li key={index}>{current}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <h3 className="part-header">
            Part 4: M-CHIP Changes in Programs and Policies
          </h3>
          {this.state.schipDisable === true ? (
            <div className="ds-c-alert ds-c-alert--hide-icon">
              <div className="ds-c-alert__body">
                <h3 className="ds-c-alert__heading">
                  This part only applies to states with a M-CHIP program.
                </h3>
                <p className="ds-c-alert__text">Skip to Section 2.</p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="part4-all-questions-container"
            hidden={this.state.schipDisable}
          >
            <p>
              Indicate any changes you’ve made to your M-CHIP programs and
              policies in the past federal fiscal year. All changes require a
              State Plan Amendment (SPA).{" "}
            </p>
            <div className="question-container">
              <div id="p4_q1">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    1. Have you made any changes to the eligibility
                    determination process?
                  </legend>
                  <Choice
                    name="p4_q1"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q1 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p4_q1"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q1 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p4_q1"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q1 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p4_q2">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    2. Have you made any changes to the eligibility
                    redetermination process?
                  </legend>
                  <Choice
                    name="p4_q2"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q2 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p4_q2"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q2 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p4_q2"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q2 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p4_q3">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    3. Have you made any changes to the eligibility levels or
                    target populations?
                  </legend>
                  {
                    //<ChoiceList hint="For example: increasing the FPL or income levels, or other eligibility criteria." />
                  }
                  <Choice
                    name="p4_q3"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q3 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p4_q3"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q3 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p4_q3"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q3 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p4_q4">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    4. Have you made any changes to the benefits available to
                    enrollees?
                  </legend>
                  {
                    //<ChoiceList hint="For example: adding or removing different types of coverage." />
                  }
                  <Choice
                    name="p4_q4"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q4 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p4_q4"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q4 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p4_q4"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q4 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
            </div>
            <div className="question-container">
              <div id="p4_q5">
                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                  <legend className="ds-c-label">
                    5. Have you made any changes to the single streamlined
                    application?
                  </legend>
                  <Choice
                    name="p4_q5"
                    type="radio"
                    value="yes"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q5 === "yes"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    Yes
                  </Choice>
                  <Choice
                    name="p4_q5"
                    type="radio"
                    value="no"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q5 === "no"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    No
                  </Choice>
                  <Choice
                    name="p4_q5"
                    type="radio"
                    value="na"
                    defaultChecked={
                      this.props.previousEntry === "true"
                        ? this.state.ly_p4_q5 === "na"
                          ? true
                          : false
                        : false
                    }
                    onChange={this.setConditional}
                  >
                    N/A
                  </Choice>
                </fieldset>
              </div>
              <div className="question-container">
                <div id="p4_q6">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      6. Have you made any changes to your outreach efforts?
                    </legend>
                    {
                      //<ChoiceList hint="For example: allotting more or less funding for outreach, or changing your target population."/>
                    }
                    <Choice
                      name="p4_q6"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q6 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q6"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q6 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q6"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q6 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q7">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      7. Have you made any changes to the delivery system(s)?
                    </legend>
                    {
                      //<ChoiceList hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."/>
                    }
                    <Choice
                      name="p4_q7"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q7 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q7"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q7 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q7"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q7 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q8">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      8. Have you made any changes to cost-sharing requirements?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing amounts, populations, or the collection process."/>
                    }
                    <Choice
                      name="p4_q8"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q8 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q8"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q8 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q8"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q8 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q9">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      9. Have you made any changes to the crowd-out policies?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing substitutions or the waiting periods."/>
                    }
                    <Choice
                      name="p4_q9"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q9 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q9"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q9 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q9"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q9 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q10">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      10. Have you made any changes to an enrollment freeze
                      and/or enrollment cap?
                    </legend>
                    <Choice
                      name="p4_q10"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q10 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q10"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q10 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q10"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q10 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q11">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      11. Have you made any changes to the enrollment process
                      for health plan selection?
                    </legend>
                    <Choice
                      name="p4_q11"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q11 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q11"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q11 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q11"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q11 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q12">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      12. Have you made any changes to the protections for
                      applicants and enrollees?
                    </legend>
                    {
                      //<ChoiceList hint="For example: changing from the Medicaid Fair Hearing Process to state law."/>
                    }
                    <Choice
                      name="p4_q12"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q12 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q12"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q12 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q12"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q12 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q13">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      13. Have you made any changes to premium assistance?
                    </legend>
                    {
                      //<ChoiceList hint="For example: adding premium assistance or changing the population that receives premium assistance."/>
                    }
                    <Choice
                      name="p4_q13"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q13 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q13"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q13 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q13"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q13 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q14">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      14. Have you made any changes to the methods and
                      procedures for preventing, investigating, or referring
                      fraud or abuse cases?
                    </legend>
                    <Choice
                      name="p4_q14"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q14 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                      checkedChildren={
                        <div className="ds-c-choice__checkedChild">
                          {
                            <div className="part4-yes">
                              <h3>
                                Do you plan to submit a SPA (State Plan
                                Amendment) to reflect these changes if you
                                haven’t done so already?
                              </h3>
                              <Choice
                                name="p4_q21"
                                type="radio"
                                value="yes"
                                defaultChecked={
                                  this.props.previousEntry === "true"
                                    ? this.state.ly_p4_q21 === "yes"
                                      ? true
                                      : false
                                    : false
                                }
                                onChange={this.setConditional}
                              >
                                Yes
                              </Choice>
                              <Choice
                                name="p4_q21"
                                type="radio"
                                value="no"
                                defaultChecked={
                                  this.props.previousEntry === "true"
                                    ? this.state.ly_p4_q21 === "no"
                                      ? true
                                      : false
                                    : false
                                }
                                onChange={this.setConditional}
                              >
                                No
                              </Choice>

                              <ul>
                                {this.state.p4_yes
                                  .sort()
                                  .map((current, index) => (
                                    <li key={index}>{current}</li>
                                  ))}
                              </ul>
                            </div>
                          }
                        </div>
                      }
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q14"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q14 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q14"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q14 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
                {/*this.state.p4_yes.sort().length > 0 ? (
                <div className="part4-yes">
                  <h3>
                    Do you plan to submit a SPA (State Plan
                    Amendment) to reflect these changes if you
                    haven’t done so already?
                  </h3>
                  <ChoiceList
                    choices={[
                      {
                        label: "Yes",
                        value: "yes",
                      },
                      {
                        label: "No",
                        value: "no",
                      },
                    ]}
                    className="p4_q21"
                    label=""
                    name="p4_q21"
                    type="radio"
                  />
                  <ul>
                    {this.state.p4_yes
                      .sort()
                      .map((current, index) => (
                        <li key={index}>{current}</li>
                      ))}
                  </ul>
                </div>
              ) : (
                ""
              )*/}
              </div>
              <div className="question-container">
                <div id="p4_q15">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      15. Have you made any changes to your prenatal care
                      eligibility?
                    </legend>
                    {
                      //<ChoiceList hint="For example: expanding eligibility to pregnant enrollees."/>
                    }
                    <Choice
                      name="p4_q15"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q15 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q15"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q15 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q15"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q15 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q16">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      16. Have you made any changes to your Pregnant Woman State
                      Plan expansion?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p4_q16"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q16 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q16"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q16 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q16"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q16 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q17">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      17. Have you made any changes to eligibility for “lawfully
                      residing pregnant women”?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p4_q17"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q17 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q17"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q17 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q17"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q17 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q18">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      18. Have you made any changes to eligibility for “lawfully
                      residing children”?
                    </legend>
                    {
                      //<ChoiceList hint="For example: extending coverage to pregnant enrollees."/>
                    }
                    <Choice
                      name="p4_q18"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q18 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q18"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q18 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q18"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q18 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q19">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      19. Have you made any changes to any other program areas?
                    </legend>
                    <Choice
                      name="p4_q19"
                      type="radio"
                      value="yes"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q19 === "yes"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      Yes
                    </Choice>
                    <Choice
                      name="p4_q19"
                      type="radio"
                      value="no"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q19 === "no"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      No
                    </Choice>
                    <Choice
                      name="p4_q19"
                      type="radio"
                      value="na"
                      defaultChecked={
                        this.props.previousEntry === "true"
                          ? this.state.ly_p4_q19 === "na"
                            ? true
                            : false
                          : false
                      }
                      onChange={this.setConditional}
                    >
                      N/A
                    </Choice>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <div id="p4_q20">
                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                    <legend className="ds-c-label">
                      20. Anything else you’d like to add that wasn’t already
                      covered?
                    </legend>
                    <TextField label="" multiline name="p4_q20" rows="6" />
                  </fieldset>
                </div>
              </div>
              {
                //This is a duplicate question that is under yes of Q14
                this.state.p4_yes.sort().length > 0 ? (
                  <div className="part4-yes">
                    <h3>
                      Do you plan to submit a SPA (State Plan Amendment) to
                      reflect these changes if you haven’t done so already?
                    </h3>
                    <ul>
                      {this.state.p4_yes.sort().map((current, index) => (
                        <li key={index}>{current}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ""
                )
              }
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions1);
