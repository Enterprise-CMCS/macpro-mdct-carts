import React, { Component } from "react";
import {
  Button as button,
  ChoiceList,
  TextField,
} from "@cmsgov/design-system-core";
import Sidebar from "../layout/Sidebar";

class Section3c extends Component {
  render() {
    return (
      <div className="section-3c">
        <div className="sidebar">
          <h1>{this.props.name} CARTS FY2020</h1>
          <Sidebar />
        </div>

        <div className="main">
          <div className="tabs section-tabs">
            <ul>
              <li>
                <a href="/3c">Section 3C: Performance Goals</a>
              </li>
              <li>
                <a href="#FYLastYear">FY2019 answers</a>
              </li>
            </ul>
          </div>
          <div className="section-content">
            <form>
              <div>
                <h3 className="part-header">
                  Part 1: Eligibility Renewal and Retention
                </h3>
                <div className="question-container">
                  <fieldset class="ds-c-fieldset">
                    <div className="fillForm">
                      <a href="#same">Same as last year</a>
                    </div>
                    <div className="question">
                      1. Do you have authority in your CHIP state plan to
                      provide for presumptive eligibility, and have you
                      implemented this?
                    </div>
                    <ChoiceList
                      choices={[
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" },
                      ]}
                      className="ds-u-margin-top--0 p1_q1"
                      label=""
                      name="p1_q1"
                      hint="Note: This question may not apply to Medicaid Expansion states."
                    />
                    <div className="conditional">
                      <TextField
                        label="What percentage of children are presumptively enrolled in CHIP pending a full eligibility determination?"
                        multiline
                        name="p1_q1__a"
                        rows="6"
                      />
                      <TextField
                        hint="Maximum 7,500 characters"
                        label="Of those children who are presumptively enrolled, what percentage are determined fully eligible and enrolled in the program?"
                        multiline
                        name="p1_q1__b"
                        rows="6"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <div className="question">
                    2. Tell us how your state simplifies the eligibility renewal
                    process for families in order to retain more children in
                    CHIP.
                  </div>
                  <ChoiceList
                    choices={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    className="ds-u-margin-top--0"
                    label="a. Do you conduct follow-up communication with families through caseworkers and outreach workers?"
                    name="p1_q1__a"
                  />
                  <ChoiceList
                    choices={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    className="ds-u-margin-top--0"
                    label="b. Do you send renewal reminder notices to all families?"
                    name="p1_q1__b"
                  />
                  <TextField
                    label="c. How many notices do you send to families before disenrolling a child from the program?"
                    labelClassName="ds-u-margin-top--0 p1_q1__c"
                    name="p1_q1__c"
                  />
                  <TextField
                    label="d. How many notices do you send to families before disenrolling a child from the program?"
                    labelClassName="ds-u-margin-top--0 p1_q1__d"
                    name="p1_q1__d"
                  />
                  <TextField
                    label="e. What else do you do to simplify the eligibility renewal process for families in order to increase retention?"
                    labelClassName="ds-u-margin-top--0 p1_q1__e"
                    name="p1_q1__e"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <div className="question">
                    3. Which retention strategies have been most effective in
                    your state?
                  </div>
                  <TextField
                    hint="Maximum 7,500 characters"
                    label=""
                    multiline
                    rows="6"
                    name="p1_q3"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <div className="question">
                    4. How have you evaluated the effectiveness of your
                    strategies?
                  </div>
                  <TextField
                    hint="Maximum 7,500 characters"
                    label=""
                    multiline
                    rows="6"
                    name="p1_q4"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <div className="question">
                    5. What data sources and methodology do you use for tracking
                    effectiveness?
                  </div>
                  <TextField
                    hint="Maximum 7,500 characters"
                    label=""
                    multiline
                    rows="6"
                    name="p1_q5"
                  />
                </fieldset>
              </div>
              <h3 className="part-header">Part 2: Eligibility Data</h3>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <div className="question">
                    A. Denials of Title XXI Coverage in FFY 2019
                    <div className="hint">
                      Enter your data below and the percentages will be
                      automatically calculated in the final report.
                    </div>
                  </div>
                  <TextField
                    hint="This only includes denials for Title XXI at the time of initial application, not redetermination"
                    label="1. How many applicants were denied Title XXI coverage?"
                    labelClassName="ds-u-margin-top--0 p2_q1"
                    name="p2_q1"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <TextField
                    hint="For example: an incomplete application, missing documentation, missing enrollment fee, etc."
                    label="2. How many applications were denied Title XXI coverage for procedural denials?"
                    labelClassName="ds-u-margin-top--0 p2_q2"
                    name="p2_q2"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <TextField
                    hint="For example: income was too high, income was too low, they were determined Medicaid eligible instead, they had other coverage instead, etc."
                    label="3. How many applicants were denied Title XXI coverage for eligibility denials?"
                    labelClassName="ds-u-margin-top--0 p2_q3"
                    name="p2_q3"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <TextField
                    label="4. How many applicants were denied Title XXI coverage and determined eligible for Title XIX instead?"
                    labelClassName="ds-u-margin-top--0 p2_q4"
                    name="p2_q4"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <TextField
                    label="5. How many applicants were denied Title XXI coverage for other reasons?"
                    labelClassName="ds-u-margin-top--0 p2_q5"
                    name="p2_q5"
                  />
                </fieldset>
              </div>
              <div className="question-container">
                <fieldset class="ds-c-fieldset">
                  <div className="fillForm">
                    <a href="#same">Same as last year</a>
                  </div>
                  <TextField
                    hint="(Maximum 7,500 characters)"
                    label="6. Did you run into any limitations when collecting data? Anything else you'd like to add about this section that wasn't already covered?"
                    labelClassName="ds-u-margin-top--0 p2_q6"
                    multiline
                    name="p2_q6"
                    rows="6"
                  />
                </fieldset>
              </div>
              <div className="form-options">
                <button
                  type="submit"
                  className="ds-c-button ds-c-button--disabled"
                >
                  Saved
                </button>
                <a href="#export" id="export">
                  Export
                </a>
              </div>
            </form>

            {/* <Objective2b /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Section3c;
