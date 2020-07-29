import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageInfo from "../layout/PageInfo";
import FormNavigation from "../layout/FormNavigation";
import FormActions from "../layout/FormActions";
import FPL from "../layout/FPL";
import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section1Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      p1_q1: "",
      p1_q1__a: "",
      p1_q1__a_1: "",
      p1_q1__a_2: "",
      p1_q1__b: "",
      p1_q2: "",
      p1_q2__a: "",
      p1_q2__b: "",
      p1_q2__c: "",
      p1_q2__d: "",
      p1_q2__e: "",
      p1_q3: "",
      p1_q4: "",
      p1_q4__a: "",
      p1_q5: "",
      p2_q1: "",
      p2_q2: "",
      p2_q3: "",
      p2_q4: "",
      p2_q4__a: "",
      p2_q5: "",
      p2_q6: "",
      fillFormTitle: "Same as last year",
      pageTitle: "Section 1: Program Fees and Policy Changes",
      mchipDisable: false,
      schipDisable: false,

      p1q2Disable: true,
      p2q2Disable: true,
      p3_yes: [],
      p4_yes: [],

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
        component: <FPL />,
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
      component: <FPL />,
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
      <div className="section-1 ds-l-col--9 content">
        {this.setProgramDisable}
        {this.setQuestionDisable}
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h2>{this.state.pageTitle}</h2>
          </div>
          <div className="section-content">
            <h2>{this.state.pageTitle}</h2>
            <form>
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

                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p1_q1"
                          label=""
                          name="p1_q1"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>

                      <div className="conditional">
                        <TextField
                          label="a) How much is your enrollment fee?"
                          name="p1_q1__a"
                          mask="currency"
                          value="9999.99"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p1_q2">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          2. Does your program charge a premium fee?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p1_q2"
                          label=""
                          name="p1_q2"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>

                      <div className="conditional">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            a) Are your premium fees tiered by Federal Poverty
                            Level (FPL)?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p1_q2__a"
                            label=""
                            name="p1_q2__a"
                            onChange={this.setConditional}
                          />
                        </fieldset>
                      </div>

                      {this.state.p1_q2__a === "yes" ? (
                        <div className="conditional">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
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
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.p1_q2__a === "no" ? (
                        <div className="conditional">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label"></legend>
                            <TextField
                              label="c) How much is your premium fee?"
                              name="p1_q1__a__1"
                              mask="currency"
                              disabled
                            />
                          </fieldset>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {this.state.p1q2Disable === true &&
                  this.state.p1_q2 === "" ? (
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
                  {this.state.p1q2Disable === true && this.state.p1_q2 != "" ? (
                    <div className="ds-c-alert ds-c-alert--hide-icon">
                      <div className="ds-c-alert__body">
                        <h3 className="ds-c-alert__heading">
                          Questions 3-4 skipped based on your answers to
                          previous questions.
                        </h3>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="question-container">
                    <div id="p1_q3" hidden={this.state.p1q2Disable}>
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          3. Is the maximum premium fee a family would be
                          charged each year tiered by FPL?
                        </legend>
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
                          className="p1_q3"
                          label=""
                          name="p1_q3"
                          onChange={this.setConditional}
                          hint={
                            this.state.p1q2Disable === true
                              ? "This question is not required if the answer to Part 1 Question 2 is No."
                              : ""
                          }
                        />
                      </fieldset>
                      {this.state.p1_q3 === "yes" ? (
                        <div className="conditional">
                          a) Indicate the premium fee ranges and corresponding
                          FPL ranges Max family premium fees tiered by FPL
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
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.p1_q3 === "no" ? (
                        <div className="conditional">
                          <TextField
                            label="b) What’s the maximum premium fee a family would be charged each year?"
                            name="p1_q3__a"
                            mask="currency"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p1_q4" hidden={this.state.p1q2Disable}>
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          4. Do your premium fees differ for different CHIP
                          populations beyond FPL (for example, by age)?
                        </legend>
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
                          className="p1_q4"
                          label=""
                          name="p1_q4"
                          onChange={this.setConditional}
                          hint={
                            this.state.p1q2Disable === true
                              ? "This question is not required if the answer to Part 1 Question 2 is No."
                              : ""
                          }
                        />
                      </fieldset>
                      {this.state.p1_q4 === "yes" ? (
                        <div className="conditional">
                          <TextField
                            label="a) Please briefly explain the fee structure breakdown."
                            multiline
                            name="p1_q4__a"
                            rows="6"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p1_q5">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          5. Which delivery system(s) do you use?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Managed Care Organization (MCO)",
                              value: "Managed Care Organization (MCO)",
                              disabled: true,
                            },
                            {
                              label: "Primary Care Case Management (PCCM)",
                              value: "Primary Care Case Management (PCCM)",
                              disabled: true,
                            },
                            {
                              label: "Fee for Service (FFS)",
                              value: "Fee for Service (FFS)",
                              disabled: true,
                            },
                          ]}
                          className="p1_q5"
                          label=""
                          multiple
                          name="p1_q5"
                          hint="Select all that apply."
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p1_q6">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          6. Which delivery system(s) are available to which
                          CHIP populations? Indicate whether eligibility status,
                          income level, age range, or other criteria determine
                          which delivery system a population receives.
                        </legend>
                        <div className="textfield">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Donec viverra, mi dapibus blandit ultricies,
                          tortor metus venenatis nulla, ac lacinia tortor massa
                          sit amet nisl. Sed lacinia purus vel lectus facilisis,
                          a suscipit ex aliquam. Donec blandit sem fringilla
                          orci blandit vehicula.
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <h3 className="part-header">
                  Part 2: M-CHIP Enrollment and Premium Fees
                </h3>
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
                        <ChoiceList
                          choices={[
                            {
                              label: "No",
                              value: "no",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p2_q1"
                          label=""
                          name="p2_q1"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>
                      {this.state.p2_q1 === "yes" ? (
                        <div className="conditional">
                          <TextField
                            label="a) How much is your enrollment fee?"
                            name="p2_q1__a"
                            mask="currency"
                            disabled
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p2_q2">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          2. Does your program charge a premium fee?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p2_q2"
                          label=""
                          name="p2_q2"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>

                      <div className="conditional">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            a) Are your premium fees tiered by Federal Poverty
                            Level (FPL)?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p2_q2__a"
                            label=""
                            name="p2_q2__a"
                            type="radio"
                            onChange={this.setConditional}
                          />
                        </fieldset>
                      </div>

                      {this.state.p2_q2__a === "yes" ? (
                        <div className="conditional">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label">
                              b) Indicate the premium fee ranges and
                              corresponding FPL ranges.
                            </legend>
                            {this.state.p2_q2_fpl.map((element) => (
                              <div key={element.id}>{element.component}</div>
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
                        </div>
                      ) : (
                        ""
                      )}
                      {this.state.p2_q2__a === "no" ? (
                        <div className="conditional">
                          <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                            <legend className="ds-c-label"></legend>
                            <TextField
                              label="c) How much is your premium fee?"
                              name="p2_q2__a__1"
                              mask="currency"
                            />
                          </fieldset>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {this.state.p2q2Disable === true &&
                  this.state.p2_q2 === "" ? (
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
                  {this.state.p2q2Disable === true && this.state.p2_q2 != "" ? (
                    <div className="ds-c-alert ds-c-alert--hide-icon">
                      <div className="ds-c-alert__body">
                        <h3 className="ds-c-alert__heading">
                          Questions 3-4 skipped based on your answers to
                          previous questions.
                        </h3>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="question-container">
                    <div id="p2_q3" hidden={this.state.p2q2Disable}>
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          3. Is the maximum premium fee a family would be
                          charged each year tiered by FPL?
                        </legend>
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
                          className="p2_q3"
                          label=""
                          name="p2_q3"
                          onChange={this.setConditional}
                          hint={
                            this.state.p2q2Disable === true
                              ? "This question is not required if the answer to Part 2 Question 2 is No."
                              : ""
                          }
                        />
                      </fieldset>
                      {this.state.p2_q3 === "yes" ? (
                        <div className="conditional">
                          a) Indicate the premium fee ranges and corresponding
                          FPL ranges.
                          {this.state.p2_q3_fpl.map((element) => (
                            <div key={element.id}>{element.component}</div>
                          ))}
                          <button
                            onClick={(e) => this.newFPL("p2_q3_fpl")}
                            type="button"
                            className="ds-c-button ds-c-button--primary"
                          >
                            Add another fee?
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="conditional">
                        <TextField
                          label="b) What’s the maximum premium fee a family would be charged each year?"
                          name="p2_q3__a"
                          mask="currency"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p2_q4" hidden={this.state.p2q2Disable}>
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          4. Do your premium fees differ for different CHIP
                          populations beyond FPL (for example, by age)?
                        </legend>
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
                          className="p2_q4"
                          label=""
                          name="p2_q4"
                          onChange={this.setConditional}
                          hint={
                            this.state.p2q2Disable === true
                              ? "This question is not required if the answer to Part 2 Question 2 is No."
                              : ""
                          }
                        />
                      </fieldset>
                      {this.state.p2_q4 === "yes" ? (
                        <div className="conditional">
                          <TextField
                            label="a) Please briefly explain the fee structure breakdown."
                            multiline
                            name="p2_q4__a"
                            rows="6"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p2_q5">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          5. Which delivery system(s) do you use?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Managed Care Organization (MCO)",
                              value: "Managed Care Organization (MCO)",
                              defaultChecked: true,
                              disabled: true,
                            },
                            {
                              label: "Primary Care Case Management (PCCM)",
                              value: "Primary Care Case Management (PCCM)",
                              disabled: true,
                            },
                            {
                              label: "Fee for Service (FFS)",
                              value: "Fee for Service (FFS)",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p2_q5"
                          label=""
                          multiple
                          name="p2_q5"
                          hint="Select all that apply."
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p2_q6">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          6. Which delivery system(s) are available to which
                          CHIP populations? Indicate whether eligibility status,
                          income level, age range, or other criteria determine
                          which delivery system a population receives.
                        </legend>
                        <div className="unanswered-text"> </div>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <h3 className="part-header">
                  Part 3: S-CHIP Changes in Programs and Policies
                </h3>
                <div
                  className="part3-all-questions-container"
                  hidden={this.state.mchipDisable}
                >
                  <p>
                    Indicate any changes you’ve made to your S-CHIP programs and
                    policies in the past federal fiscal year. All changes
                    require a State Plan Amendment (SPA).{" "}
                  </p>
                  <div className="question-container">
                    <div id="p3_q1">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          1. Have you made any changes to the eligibility
                          determination process?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "No",
                              value: "no",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p3_q1"
                          label=""
                          name="p2_q1"
                          onChange={this.setConditional}
                          type="radio"
                        />
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
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p2_q2"
                          label=""
                          name="p3_q2"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p3_q3">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          3. Have you made any changes to the eligibility levels
                          or target populations?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "N/A",
                              value: "n/a",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p3_q3"
                          label=""
                          name="p3_q3"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p3_q4">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          4. Have you made any changes to the benefits available
                          to enrollees?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "No",
                              value: "no",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p2_q1"
                          label=""
                          name="p2_q1"
                          onChange={this.setConditional}
                          type="radio"
                        />
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
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "no",
                              defaultChecked: true,
                              disabled: true,
                            },
                          ]}
                          className="p3_q5"
                          label=""
                          name="p3_q5"
                          onChange={this.setConditional}
                          type="radio"
                        />
                      </fieldset>
                    </div>
                    <div className="question-container">
                      <div id="p3_q6">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            6. Have you made any changes to your outreach
                            efforts?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p3_q6"
                            hint="For example: allotting more or less funding for outreach, or changing your target population."
                            label=""
                            name="p3_q6"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q7">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            7. Have you made any changes to the delivery
                            system(s)?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p3_q7"
                            hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."
                            label=""
                            name="p3_q7"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q8">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            8. Have you made any changes to cost-sharing
                            requirements?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p3_q8"
                            hint="For example: changing amounts, populations, or the collection process."
                            label=""
                            name="p3_q8"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q9">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            9. Have you made any changes to the crowd-out
                            policies?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                              },
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                              },
                              {
                                label: "N/A",
                                value: "na",
                                disabled: true,
                              },
                            ]}
                            className="p3_q9"
                            hint="For example: changing substitutions or the waiting periods."
                            label=""
                            name="Q09: Crowd-out policies"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q10">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            10. Have you made any changes to an enrollment
                            freeze and/or enrollment cap?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="p3_q10"
                            label=""
                            name="p3_q10"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q11">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            11. Have you made any changes to the enrollment
                            process for health plan selection?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q11"
                            label=""
                            name="p3_q11"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
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
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q12"
                            hint="For example: changing from the Medicaid Fair Hearing Process to state law."
                            label=""
                            name="p3_q12"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q13">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            13. Have you made any changes to premium assistance?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q13"
                            hint="For example: adding premium assistance or changing the population that receives premium assistance."
                            label=""
                            name="p3_q13"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q14">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            14. Have you made any changes to the methods and
                            procedures for preventing, investigating, or
                            referring fraud or abuse cases?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q14"
                            label=""
                            name="p3_q14"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
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
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q15"
                            hint="For example: expanding eligibility to pregnant enrollees."
                            label=""
                            name="p3_q15"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q16">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            16. Have you made any changes to your Pregnant Woman
                            State Plan expansion?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q16"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name="p3_q16"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q17">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            17. Have you made any changes to eligibility for
                            “lawfully residing pregnant women”?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q17"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name="p3_q17"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q18">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            18. Have you made any changes to eligibility for
                            “lawfully residing children”?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                              },
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                              },
                              {
                                label: "N/A",
                                value: "na",
                                disabled: true,
                              },
                            ]}
                            className="p3_q18"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name="Q18: Eligibility for “lawfully residing children”"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q19">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            19. Have you made any changes to any other program
                            areas?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p3_q19"
                            label=""
                            name="p3_q19"
                            type="radio"
                            onChange={(e) => this.setKeyword("p3", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p3_q20">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            20. Anything else you’d like to add that wasn’t
                            already covered?
                          </legend>
                          <div className="textfield">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec viverra, mi dapibus blandit ultricies,
                            tortor metus venenatis nulla, ac lacinia tortor
                            massa sit amet nisl. Sed lacinia purus vel lectus
                            facilisis, a suscipit ex aliquam. Donec blandit sem
                            fringilla orci blandit vehicula. Sed et ante
                            vulputate, porttitor nisi non, commodo risus.
                            Praesent facilisis, arcu nec mattis bibendum, sapien
                            tortor fermentum purus, id semper justo lacus at
                            eros. Donec ligula felis, vulputate quis purus quis,
                            accumsan imperdiet magna. Sed sodales ligula
                            iaculis, accumsan nisl eu, commodo nunc. Cras
                            commodo mattis nibh, sed mattis lacus blandit ut.
                            Sed sit amet pellentesque massa. Pellentesque luctus
                            tortor eu lorem sagittis consectetur. Vestibulum
                            ante ipsum primis in faucibus orci luctus et
                            ultrices posuere cubilia curae
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    {this.state.p3_yes.length > 0 ? (
                      <div className="part3-yes">
                        <h3>
                          Do you plan to submit a SPA (State Plan Amendment) to
                          reflect these changes if you haven’t done so already?
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
                    policies in the past federal fiscal year. All changes
                    require a State Plan Amendment (SPA).{" "}
                  </p>
                  <div className="question-container">
                    <div id="p4_q1">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          1. Have you made any changes to the eligibility
                          determination process?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              disabled: true,
                              defaultChecked: true,
                            },
                          ]}
                          className="p4_q1"
                          label=""
                          name="Q01: Eligibility determination process"
                          type="radio"
                          onChange={(e) => this.setKeyword("p4", e)}
                        />
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
                        <ChoiceList
                          choices={[
                            {
                              label: "N/A",
                              value: "na",
                              disabled: true,
                              defaultChecked: true,
                            },
                          ]}
                          className="p4_q2"
                          label=""
                          name="Q02: Eligibility redetermination process"
                          type="radio"
                          onChange={(e) => this.setKeyword("p4", e)}
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p4_q3">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          3. Have you made any changes to the eligibility levels
                          or target populations?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              disabled: true,
                              defaultChecked: true,
                            },
                          ]}
                          className="p4_q3"
                          hint="For example: increasing the FPL or income levels, or other eligibility criteria."
                          label=""
                          name="Q03: Eligibility levels or target population"
                          type="radio"
                          onChange={(e) => this.setKeyword("p4", e)}
                        />
                      </fieldset>
                    </div>
                  </div>
                  <div className="question-container">
                    <div id="p4_q4">
                      <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                        <legend className="ds-c-label">
                          4. Have you made any changes to the benefits available
                          to enrollees?
                        </legend>
                        <ChoiceList
                          choices={[
                            {
                              label: "No",
                              value: "no",
                              disabled: true,
                              defaultChecked: true,
                            },
                          ]}
                          className="p4_q4"
                          hint="For example: adding or removing different types of coverage.
                                  "
                          label=""
                          name="Q04: Benefits available to enrollees"
                          type="radio"
                          onChange={(e) => this.setKeyword("p4", e)}
                        />
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
                        <ChoiceList
                          choices={[
                            {
                              label: "Yes",
                              value: "yes",
                              disabled: true,
                              defaultChecked: true,
                            },
                          ]}
                          className="p4_q5"
                          label=""
                          name="Q05: Single streamlined application"
                          type="radio"
                          onChange={(e) => this.setKeyword("p4", e)}
                        />
                      </fieldset>
                    </div>
                    <div className="question-container">
                      <div id="p4_q6">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            6. Have you made any changes to your outreach
                            efforts?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "N/A",
                                value: "na",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q6"
                            hint="For example: allotting more or less funding for outreach, or changing your target population."
                            label=""
                            name="Q06: Outreach efforts"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q7">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            7. Have you made any changes to the delivery
                            system(s)?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q7"
                            hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."
                            label=""
                            name="Q07: Delivery system(s)"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q8">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            8. Have you made any changes to cost-sharing
                            requirements?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q8"
                            hint="For example: changing amounts, populations, or the collection process."
                            label=""
                            name="Q08: Cost-sharing requirements"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q9">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            9. Have you made any changes to the crowd-out
                            policies?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q9"
                            hint="For example: changing substitutions or the waiting periods."
                            label=""
                            name="Q09: Crowd-out policies"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q10">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            10. Have you made any changes to an enrollment
                            freeze and/or enrollment cap?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q10"
                            label=""
                            name="Q10: Enrollment freeze and/or enrollment cap"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q11">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            11. Have you made any changes to the enrollment
                            process for health plan selection?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q11"
                            label=""
                            name="Q11: Enrollment process for health plan selection"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
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
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                              },
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                              },
                              {
                                label: "N/A",
                                value: "na",
                                disabled: true,
                              },
                            ]}
                            className="p4_q12"
                            hint="For example: changing from the Medicaid Fair Hearing Process to state law."
                            label=""
                            name="Q12: Enrollment process for health plan selection"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q13">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            13. Have you made any changes to premium assistance?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q13"
                            hint="For example: adding premium assistance or changing the population that receives premium assistance."
                            label=""
                            name="Q13: Premium assistance"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q14">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            14. Have you made any changes to the methods and
                            procedures for preventing, investigating, or
                            referring fraud or abuse cases?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q14"
                            label=""
                            name="Q14: Methods and procedures for prevention, investigation, and referral of cases of fraud and abuse"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                      {this.state.p4_yes.sort().length > 0 ? (
                        <div className="part4-yes">
                          <h3>
                            Do you plan to submit a SPA (State Plan Amendment)
                            to reflect these changes if you haven’t done so
                            already?
                          </h3>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q21"
                            label=""
                            name="p4_q21"
                            type="radio"
                          />
                          <ul>
                            {this.state.p4_yes.sort().map((current, index) => (
                              <li key={index}>{current}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="question-container">
                      <div id="p4_q15">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            15. Have you made any changes to your prenatal care
                            eligibility?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q15"
                            hint="For example: expanding eligibility to pregnant enrollees."
                            label=""
                            name="Q15: Prenatal care eligibility"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q16">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            16. Have you made any changes to your Pregnant Woman
                            State Plan expansion?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q16"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name="Q16: Pregnant Woman State Plan expansion"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q17">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            17. Have you made any changes to eligibility for
                            “lawfully residing pregnant women”?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q17"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name='Q17: Eligibility for "lawfully residing pregnant women"'
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q18">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            18. Have you made any changes to eligibility for
                            “lawfully residing children”?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q18"
                            hint="For example: extending coverage to pregnant enrollees."
                            label=""
                            name="Q18: Eligibility for “lawfully residing children”"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q19">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            19. Have you made any changes to any other program
                            areas?
                          </legend>
                          <ChoiceList
                            choices={[
                              {
                                label: "No",
                                value: "no",
                                disabled: true,
                                defaultChecked: true,
                              },
                            ]}
                            className="p4_q18"
                            label=""
                            name="Q19: Other program areas"
                            type="radio"
                            onChange={(e) => this.setKeyword("p4", e)}
                          />
                        </fieldset>
                      </div>
                    </div>
                    <div className="question-container">
                      <div id="p4_q20">
                        <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                          <legend className="ds-c-label">
                            20. Anything else you’d like to add that wasn’t
                            already covered?
                          </legend>
                          <div className="textfield">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Donec viverra, mi dapibus blandit ultricies,
                            tortor metus venenatis nulla, ac lacinia tortor
                            massa sit amet nisl. Sed lacinia purus vel lectus
                            facilisis, a suscipit ex aliquam. Donec blandit sem
                            fringilla orci blandit vehicula. Sed et ante
                            vulputate, porttitor nisi non, commodo risus.
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    {this.state.p4_yes.sort().length > 0 ? (
                      <div className="part4-yes">
                        <h3>
                          Do you plan to submit a SPA (State Plan Amendment) to
                          reflect these changes if you haven’t done so already?
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
                          {this.state.p4_yes.sort().map((current, index) => (
                            <li key={index}>{current}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  programType: state.stateUser.programType,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section1Review);
