import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import NavigationButton from "../../layout/NavigationButtons";
import {
  Button as button,
  Choice,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section1 extends Component {
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
      p1_q5: "",
      p2_q1: "",
      p2_q2: "",
      p2_q3: "",
      p2_q4: "",
      p2_q5: "",
      p2_q6: "",
      fillFormTitle: "Same as last year",
      mchipDisable: false,
      schipDisable: false,
      p1q2Disable: true,
    };

    this.setConditional = this.setConditional.bind(this);
    this.setProgramDisable = this.setProgramDisable(this);
    this.setQuestionDisable = this.setQuestionDisable.bind(this);
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    console.log("response: " + this.state.p1_q2);
    // el.target.defaultChecked = true;
    this.setQuestionDisable(el.target.value);
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setProgramDisable () {
    {this.props.programType === "M-CHIP" ? (this.state.mchipDisable = true) : (this.statemchipDisable = false) };
    {this.props.programType === "S-CHIP" ? (this.state.schipDisable = true) : (this.stateschipDisable = false) };
  }

  //set the flags for the custom div property disabled (_layout.scss) based on the selected programType
  //true means the section will be disabled
  //false means the section will be enabled
  setQuestionDisable(e) {
    {e === "yes" ? (this.setState({ p1q2Disable: false })) : (this.setState({ p1q2Disable: true })) };
    console.log("response: " + this.state.p1_q2)
  }

  render() {
    return (
      <div className="section-1">
        {this.setProgramDisable}
        {this.setQuestionDisable}

        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <PageInfo />
              <div className="section-content">
                <Tabs>
                  <TabPanel
                    id="tab-form"
                    tab="Section 1: Program Fees and Policy Changes"
                  >
                    <form>
                      <div>
                        <h3 className="part-header">
                          Part 1: S-CHIP Enrollment and Premium Fees
                        </h3>
                        {this.state.mchipDisable === true ? (
                          <p>This part only applies to states with a S-CHIP program. Please skip to Part 2.</p>
                        ) : (
                          ""
                        )}
                        <div 
                          className="part1-all-questions-container" 
                          disabled={this.state.mchipDisable}
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
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                  ]}
                                  className="p1_q1"
                                  label=""
                                  name="p1_q1"
                                  onChange={this.setConditional}
                                />
                              </fieldset>
                              {this.state.p1_q1 === "yes" ? (
                                <div className="conditional">
                                  <TextField
                                    label="a) How much is your enrollment fee?"
                                    multiline
                                    name="p1_q1__a"
                                    rows="6"
                                  />
                                </div>
                              ) : (
                                ""
                              )}
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
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                  ]}
                                  className="p1_q2"
                                  label=""
                                  name="p1_q2"
                                  onChange={this.setConditional}
                                />
                              </fieldset>
                              {this.state.p1_q2 === "yes" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      a) Are your premium fees tiered by Federal
                                      Poverty Level (FPL)?
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
                                      className="p1_q2__a"
                                      label=""
                                      name="p1_q2__a"
                                      onChange={this.setConditional}
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p1_q2__a === "yes" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      b) Indicate the premium fee ranges and
                                      corresponding FPL ranges.
                                    </legend>
                                    Premium fees tiered by FPL
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
                                      className="p1_q2__a_1"
                                      label=""
                                      name="p1_q2__a_1"
                                      onChange={this.setConditional}
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p1_q2__a === "no" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      Premium fees tiered basy FPL
                                    </legend>
                                    <TextField
                                      label="c) How much is your premium fee?"
                                      multiline
                                      name="p1_q1__a__1"
                                      rows="6"
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p1_q3" disabled={this.state.p1q2Disable}>
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
                                />
                              </fieldset>
                              {this.state.p1_q3 === "yes" ? (
                                <div className="conditional">
                                  a) Indicate the premium fee ranges and
                                  corresponding FPL ranges Max family premium fees
                                  tiered by FPL
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p1_q3 === "no" ? (
                                <div className="conditional">
                                  <TextField
                                    label="b) What’s the maximum premium fee a family would be charged each year?
                                    "
                                    multiline
                                    name="p1_q3__a"
                                    rows="6"
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p1_q4" disabled={this.state.p1q2Disable}>
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  4. Does your program charge an enrollment fee?
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
                                />
                              </fieldset>
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
                                    },
                                    {
                                      label:
                                        "Primary Care Case Management (PCCM)",
                                      value:
                                        "Primary Care Case Management (PCCM)",
                                    },
                                    {
                                      label: "Fee for Service (FFS)",
                                      value: "Fee for Service (FFS)",
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
                                  6. Which delivery system(s) are available to
                                  which CHIP populations? Indicate whether
                                  eligibility status, income level, age range, or
                                  other criteria determine which delivery system a
                                  population receives.
                                </legend>
                                <TextField
                                  label=""
                                  multiline
                                  name="p1_q3__a"
                                  rows="6"
                                />
                              </fieldset>
                            </div>
                          </div>
                        </div>

                        <h3 className="part-header">
                          Part 2: M-CHIP Enrollment and Premium Fees
                        </h3>
                        {this.state.schipDisable === true ? (
                          <p>This part only applies to states with a M-CHIP program. Please skip to Section 2: Eligibility and Enrollment.</p>
                        ) : (
                          ""
                        )}
                        <div 
                          className="part2-all-questions-container" 
                          disabled={this.state.schipDisable}
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
                                      label: "Yes",
                                      value: "yes",
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                  ]}
                                  className="p2_q1"
                                  label=""
                                  name="p2_q1"
                                  onChange={this.setConditional}
                                />
                              </fieldset>
                              {this.state.p2_q1 === "yes" ? (
                                <div className="conditional">
                                  <TextField
                                    label="a) How much is your enrollment fee?"
                                    multiline
                                    name="p2_q1__a"
                                    rows="6"
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
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                  ]}
                                  className="p2_q2"
                                  label=""
                                  name="p2_q2"
                                  onChange={this.setConditional}
                                />
                              </fieldset>
                              {this.state.p2_q2 === "yes" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      a) Are your premium fees tiered by Federal
                                      Poverty Level (FPL)?
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
                                      className="p2_q2__a"
                                      label=""
                                      name="p2_q2__a"
                                      onChange={this.setConditional}
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p2_q2__a === "yes" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      b) Indicate the premium fee ranges and
                                      corresponding FPL ranges.
                                    </legend>
                                    Premium fees tiered by FPL
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
                                      className="p2_q2__a_1"
                                      label=""
                                      name="p2_q2__a_1"
                                      onChange={this.setConditional}
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p2_q2__a === "no" ? (
                                <div className="conditional">
                                  <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                    <legend className="ds-c-label">
                                      Premium fees tiered basy FPL
                                    </legend>
                                    <TextField
                                      label="c) How much is your premium fee?"
                                      multiline
                                      name="p2_q2__a__1"
                                      rows="6"
                                    />
                                  </fieldset>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p2_q3">
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
                                />
                              </fieldset>
                              {this.state.p2_q3 === "yes" ? (
                                <div className="conditional">
                                  a) Indicate the premium fee ranges and
                                  corresponding FPL ranges.
                                </div>
                              ) : (
                                ""
                              )}
                              {this.state.p1_q3 === "no" ? (
                                <div className="conditional">
                                  <TextField
                                    label="b) What’s the maximum premium fee a family would be charged each year?
                                    "
                                    multiline
                                    name="p1_q3__a"
                                    rows="6"
                                  />
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p2_q4">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  4. Do your premium fees differ for different
                                  CHIP populations beyond FPL (for example, by
                                  age)? If so, briefly explain the fee structure
                                  breakdown.
                                </legend>
                                <TextField
                                  label=""
                                  multiline
                                  name="p2_q6"
                                  rows="6"
                                />
                              </fieldset>
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
                                    },
                                    {
                                      label:
                                        "Primary Care Case Management (PCCM)",
                                      value:
                                        "Primary Care Case Management (PCCM)",
                                    },
                                    {
                                      label: "Fee for Service (FFS)",
                                      value: "Fee for Service (FFS)",
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
                                  6. Which delivery system(s) are available to
                                  which CHIP populations? Indicate whether
                                  eligibility status, income level, age range, or
                                  other criteria determine which delivery system a
                                  population receives.
                                </legend>
                                <TextField
                                  label=""
                                  multiline
                                  name="p2_q6"
                                  rows="6"
                                />
                              </fieldset>
                            </div>
                          </div>
                        </div>

                        <h3 className="part-header">
                          Part 3: S-CHIP Changes in Programs and Policies
                        </h3>
                        <p>
                          Indicate any changes you’ve made to your S-CHIP
                          programs and policies in the past federal fiscal year.
                          All changes require a State Plan Amendment (SPA).{" "}
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
                                    label: "Yes",
                                    value: "yes",
                                  },
                                  {
                                    label: "No",
                                    value: "no",
                                  },
                                  {
                                    label: "N/A",
                                    value: "na",
                                  },
                                ]}
                                className="p3_q1"
                                label=""
                                name="Q1: Eligibility determination process"
                                onChange={this.setKeyword}
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
                                  },
                                  {
                                    label: "No",
                                    value: "no",
                                  },
                                  {
                                    label: "N/A",
                                    value: "na",
                                  },
                                ]}
                                className="p3_q2"
                                label=""
                                name="Q2: Eligibility redetermination process"
                                onChange={this.setKeyword}
                              />
                            </fieldset>
                          </div>
                        </div>
                        <div className="question-container">
                          <div id="p3_q3">
                            <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                              <legend className="ds-c-label">
                                3. Have you made any changes to the eligibility
                                levels or target populations?
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
                                  {
                                    label: "N/A",
                                    value: "na",
                                  },
                                ]}
                                className="p3_q3"
                                hint="For example: increasing the FPL or income levels, or other eligibility criteria."
                                label=""
                                name="Q3: Eligibility levels or target population"
                                onChange={this.setKeyword}
                              />
                            </fieldset>
                          </div>
                        </div>
                        <div className="question-container">
                          <div id="p3_q4">
                            <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                              <legend className="ds-c-label">
                                4. Have you made any changes to the benefits
                                available to enrollees?
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
                                  {
                                    label: "N/A",
                                    value: "na",
                                  },
                                ]}
                                className="p3_q4"
                                hint="For example: adding or removing different types of coverage.
                                "
                                label=""
                                name="Q4: Benefits available to enrollees"
                                onChange={this.setKeyword}
                              />
                            </fieldset>
                          </div>
                        </div>
                        <div className="question-container">
                          <div id="p3_q5">
                            <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                              <legend className="ds-c-label">
                                5. Have you made any changes to the single
                                streamlined application?
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
                                  {
                                    label: "N/A",
                                    value: "na",
                                  },
                                ]}
                                className="p3_q5"
                                label=""
                                name="Q5: Single streamlined application"
                                onChange={this.setKeyword}
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
                                      label: "Yes",
                                      value: "yes",
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q6"
                                  hint="For example: allotting more or less funding for outreach, or changing your target population."
                                  label=""
                                  name="Q6: Outreach efforts"
                                  onChange={this.setKeyword}
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
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q7"
                                  hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."
                                  label=""
                                  name="Q7: Delivery system(s)"
                                  onChange={this.setKeyword}
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
                                      label: "Yes",
                                      value: "yes",
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q8"
                                  hint="For example: changing amounts, populations, or the collection process."
                                  label=""
                                  name="Q8: Cost-sharing requirements"
                                  onChange={this.setKeyword}
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
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q9"
                                  hint="For example: changing substitutions or the waiting periods."
                                  label=""
                                  name="Q9: Crowd-out policies"
                                  onChange={this.setKeyword}
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
                                      label: "Yes",
                                      value: "yes",
                                    },
                                    {
                                      label: "No",
                                      value: "no",
                                    },
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q10"
                                  label=""
                                  name="Q10: Enrollment freeze and/or enrollment cap"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q11">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  11. Have you made any changes to the
                                  enrollment process for health plan selection?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q11"
                                  label=""
                                  name="Q11: Enrollment process for health plan selection"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q12">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  12. Have you made any changes to the
                                  protections for applicants and enrollees?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q12"
                                  hint="For example: changing from the Medicaid Fair Hearing Process to state law."
                                  label=""
                                  name="Q12: Enrollment process for health plan selection"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q13">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  13. Have you made any changes to premium
                                  assistance?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q13"
                                  hint="For example: adding premium assistance or changing the population that receives premium assistance."
                                  label=""
                                  name="Q13: Premium assistance"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q14">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  14. Have you made any changes to the methods
                                  and procedures for preventing, investigating,
                                  or referring fraud or abuse cases?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q14"
                                  label=""
                                  name="Q14: Methods and procedures for prevention, investigation, and referral of cases of fraud and abuse"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q15">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  15. Have you made any changes to your prenatal
                                  care eligibility?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q15"
                                  hint="For example: expanding eligibility to pregnant enrollees."
                                  label=""
                                  name="Q15: Prenatal care eligibility"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q16">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  16. Have you made any changes to your Pregnant
                                  Woman State Plan expansion?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q16"
                                  hint="For example: extending coverage to pregnant enrollees."
                                  label=""
                                  name="Q16: Pregnant Woman State Plan expansion"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q17">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  17. Have you made any changes to eligibility
                                  for “lawfully residing pregnant women”?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q17"
                                  hint="For example: extending coverage to pregnant enrollees."
                                  label=""
                                  name='Q17: Eligibility for "lawfully residing pregnant women"'
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q18">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  18. Have you made any changes to eligibility
                                  for “lawfully residing children”?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q18"
                                  hint="For example: extending coverage to pregnant enrollees."
                                  label=""
                                  name="Q18: Eligibility for “lawfully residing children”"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q19">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  19. Have you made any changes to any other
                                  program areas?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p3_q18"
                                  label=""
                                  name="Q19: Other program areas"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p3_q20">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  20. Anything else you’d like to add that
                                  wasn’t already covered?
                                </legend>
                                <TextField
                                  label=""
                                  multiline
                                  name="p3_q20"
                                  rows="6"
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="part3-yes">
                            <h3>
                              Do you plan to submit a SPA (State Plan Amendment)
                              to reflect these changes if you haven’t done so
                              already?{" "}
                            </h3>
                            Display list of questions answered yes
                          </div>
                          <h3 className="part-header">
                            Part 4: M-CHIP Changes in Programs and Policies
                          </h3>
                          <p>
                            Indicate any changes you’ve made to your M-CHIP
                            programs and policies in the past federal fiscal
                            year. All changes require a State Plan Amendment
                            (SPA).{" "}
                          </p>
                          <div className="question-container">
                            <div id="p4_q1">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  1. Have you made any changes to the
                                  eligibility determination process?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p4_q1"
                                  label=""
                                  name="Q1: Eligibility determination process"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p4_q2">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  2. Have you made any changes to the
                                  eligibility redetermination process?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p4_q2"
                                  label=""
                                  name="Q2: Eligibility redetermination process"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p4_q3">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  3. Have you made any changes to the
                                  eligibility levels or target populations?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p4_q3"
                                  hint="For example: increasing the FPL or income levels, or other eligibility criteria."
                                  label=""
                                  name="Q3: Eligibility levels or target population"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p4_q4">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  4. Have you made any changes to the benefits
                                  available to enrollees?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p4_q4"
                                  hint="For example: adding or removing different types of coverage.
                                "
                                  label=""
                                  name="Q4: Benefits available to enrollees"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                          </div>
                          <div className="question-container">
                            <div id="p4_q5">
                              <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                <legend className="ds-c-label">
                                  5. Have you made any changes to the single
                                  streamlined application?
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
                                    {
                                      label: "N/A",
                                      value: "na",
                                    },
                                  ]}
                                  className="p4_q5"
                                  label=""
                                  name="Q5: Single streamlined application"
                                  onChange={this.setKeyword}
                                />
                              </fieldset>
                            </div>
                            <div className="question-container">
                              <div id="p4_q6">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    6. Have you made any changes to your
                                    outreach efforts?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q6"
                                    hint="For example: allotting more or less funding for outreach, or changing your target population."
                                    label=""
                                    name="Q6: Outreach efforts"
                                    onChange={this.setKeyword}
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
                                      },
                                      {
                                        label: "No",
                                        value: "no",
                                      },
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q7"
                                    hint="For example: transitioning from Fee for Service to Managed Care for different CHIP populations."
                                    label=""
                                    name="Q7: Delivery system(s)"
                                    onChange={this.setKeyword}
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
                                      },
                                      {
                                        label: "No",
                                        value: "no",
                                      },
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q8"
                                    hint="For example: changing amounts, populations, or the collection process."
                                    label=""
                                    name="Q8: Cost-sharing requirements"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q9">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    9. Have you made any changes to the
                                    crowd-out policies?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q9"
                                    hint="For example: changing substitutions or the waiting periods."
                                    label=""
                                    name="Q9: Crowd-out policies"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q10">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    10. Have you made any changes to an
                                    enrollment freeze and/or enrollment cap?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q10"
                                    label=""
                                    name="Q10: Enrollment freeze and/or enrollment cap"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q11">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    11. Have you made any changes to the
                                    enrollment process for health plan
                                    selection?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q11"
                                    label=""
                                    name="Q11: Enrollment process for health plan selection"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q12">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    12. Have you made any changes to the
                                    protections for applicants and enrollees?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q12"
                                    hint="For example: changing from the Medicaid Fair Hearing Process to state law."
                                    label=""
                                    name="Q12: Enrollment process for health plan selection"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q13">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    13. Have you made any changes to premium
                                    assistance?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q13"
                                    hint="For example: adding premium assistance or changing the population that receives premium assistance."
                                    label=""
                                    name="Q13: Premium assistance"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q14">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    14. Have you made any changes to the methods
                                    and procedures for preventing,
                                    investigating, or referring fraud or abuse
                                    cases?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q14"
                                    label=""
                                    name="Q14: Methods and procedures for prevention, investigation, and referral of cases of fraud and abuse"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q15">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    15. Have you made any changes to your
                                    prenatal care eligibility?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q15"
                                    hint="For example: expanding eligibility to pregnant enrollees."
                                    label=""
                                    name="Q15: Prenatal care eligibility"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q16">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    16. Have you made any changes to your
                                    Pregnant Woman State Plan expansion?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q16"
                                    hint="For example: extending coverage to pregnant enrollees."
                                    label=""
                                    name="Q16: Pregnant Woman State Plan expansion"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q17">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    17. Have you made any changes to eligibility
                                    for “lawfully residing pregnant women”?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q17"
                                    hint="For example: extending coverage to pregnant enrollees."
                                    label=""
                                    name='Q17: Eligibility for "lawfully residing pregnant women"'
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q18">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    18. Have you made any changes to eligibility
                                    for “lawfully residing children”?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q18"
                                    hint="For example: extending coverage to pregnant enrollees."
                                    label=""
                                    name="Q18: Eligibility for “lawfully residing children”"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q19">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    19. Have you made any changes to any other
                                    program areas?
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
                                      {
                                        label: "N/A",
                                        value: "na",
                                      },
                                    ]}
                                    className="p4_q18"
                                    label=""
                                    name="Q19: Other program areas"
                                    onChange={this.setKeyword}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="question-container">
                              <div id="p4_q20">
                                <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                                  <legend className="ds-c-label">
                                    20. Anything else you’d like to add that
                                    wasn’t already covered?
                                  </legend>
                                  <TextField
                                    label=""
                                    multiline
                                    name="p4_q20"
                                    rows="6"
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="part4-yes">
                              <h3>
                                Do you plan to submit a SPA (State Plan
                                Amendment) to reflect these changes if you
                                haven’t done so already?{" "}
                              </h3>
                              Display list of questions answered yes
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </TabPanel>
                </Tabs>
                <div className="nav-buttons">
                  <NavigationButton
                    direction="Previous"
                    destination="/basic-info"
                  />

                  <NavigationButton direction="Next" destination="/2a" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
});

export default connect(mapStateToProps)(Section1);
