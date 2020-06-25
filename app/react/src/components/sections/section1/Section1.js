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
  constructor() {
    super();

    this.state = {
      p1_q1: "no",
      p1_q1__a: "",
      p1_q1__a_1: "",
      p1_q1__a_2: "",
      p1_q1__b: "",
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
      disabled: true,
    };

    this.setConditional = this.setConditional.bind(this);
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
  }

  render() {

    return (
      <div className="section-1">
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
                        <div className="part1-all-questions-container" disabled={this.state.disabled}>
                          {this.state.programType !== "M-CHIP" ? (
                            <p>This part only applies to states with a S-CHIP program. Please skip to Part 2.</p>
                          ) : (
                            ""
                          )}
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
                            <div id="p1_q3">
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
                            <div id="p1_q4">
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
