import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";
import Sidebar from "../layout/Sidebar";

class Section3c extends Component {
  constructor() {
    super();

    this.loadAnswers = this.loadAnswers.bind(this);
    this.setConditional = this.setConditional.bind(this);
  }

  setConditional(el) {
    let radio = document.getElementById("radio_p1_q1_34");
    let textField = document.getElementById("textfield_39");

    if (radio.checked) {
      textField.parentNode.parentNode.classList.remove("hide");
    } else {
      textField.parentNode.parentNode.classList.add("hide");
    }
  }

  loadAnswers(el) {
    el.preventDefault();
    let textAreaCopy =
      "This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies.";
    let textFieldCopy = "This is what you wrote last year.";

    el.target.parentNode.parentNode
      .getElementsByClassName("clear-form")[0]
      .classList.toggle("active");

    el.target.parentNode.parentNode
      .getElementsByClassName("fill-form")[0]
      .classList.toggle("active");

    switch (el.target.name) {
      case "p1_q1":
        document.getElementById("radio_p1_q1_34").checked = true;
        document.getElementById("textfield_39").value = textAreaCopy;
        document.getElementById("textfield_43").value = textAreaCopy;
        this.setConditional(el);
        break;

      case "p1_q2":
        document.getElementById("radio_p1_q1__a_46").checked = true;
        document.getElementById("radio_p1_q1__b_52").checked = true;
        document.getElementById("textfield_55").value = textFieldCopy;
        document.getElementById("textfield_59").value = textFieldCopy;
        document.getElementById("textfield_63").value = textFieldCopy;
        break;
      case "p1_q3":
        document.getElementById("textfield_67").value = textAreaCopy;
        break;
      case "p1_q4":
        document.getElementById("textfield_71").value = textAreaCopy;
        break;
      case "p1_q5":
        document.getElementById("textfield_75").value = textAreaCopy;
        break;
      case "p2_q1":
        document.getElementById("textfield_79").value = textFieldCopy;
        break;
      case "p2_q2":
        document.getElementById("textfield_83").value = textFieldCopy;
        break;
      case "p2_q3":
        document.getElementById("textfield_87").value = textFieldCopy;
        break;
      case "p2_q4":
        document.getElementById("textfield_91").value = textFieldCopy;
        break;
      case "p2_q5":
        document.getElementById("textfield_95").value = textFieldCopy;
        break;
      case "p2_q6":
        document.getElementById("textfield_99").value = textAreaCopy;
        break;
    }
  }

  clearAnswers(el) {
    el.preventDefault();

    el.target.parentNode.parentNode
      .getElementsByClassName("clear-form")[0]
      .classList.toggle("active");

    el.target.parentNode.parentNode
      .getElementsByClassName("fill-form")[0]
      .classList.toggle("active");

    switch (el.target.name) {
      case "p1_q1":
        document.getElementById("radio_p1_q1_34").checked = false;
        document.getElementById("textfield_39").value = "";
        document.getElementById("textfield_43").value = "";
        break;

      case "p1_q2":
        document.getElementById("radio_p1_q1__a_46").checked = false;
        document.getElementById("radio_p1_q1__b_52").checked = false;
        document.getElementById("textfield_55").value = "";
        document.getElementById("textfield_59").value = "";
        document.getElementById("textfield_63").value = "";
        break;
      case "p1_q3":
        document.getElementById("textfield_67").value = "";
        break;
      case "p1_q4":
        document.getElementById("textfield_71").value = "";
        break;
      case "p1_q5":
        document.getElementById("textfield_75").value = "";
        break;
      case "p2_q1":
        document.getElementById("textfield_79").value = "";
        break;
      case "p2_q2":
        document.getElementById("textfield_83").value = "";
        break;
      case "p2_q3":
        document.getElementById("textfield_87").value = "";
        break;
      case "p2_q4":
        document.getElementById("textfield_91").value = "";
        break;
      case "p2_q5":
        document.getElementById("textfield_95").value = "";
        break;
      case "p2_q6":
        document.getElementById("textfield_99").value = "";
        break;
    }
  }

  render() {
    return (
      <div className="section-3c">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <div className="page-info">
                <div className="edit-info">
                  <img src="/img/new-york-temp.png" alt="Status" /> Draft | Last
                  Edit: 4/3/20
                </div>
                <h1>{this.props.name} CARTS FY2020</h1>
              </div>
              <div className="section-content">
                <Tabs>
                  <TabPanel id="tab-form" tab="Section 3C: Eligibility">
                    <form>
                      <div>
                        <h3 className="part-header">
                          Part 1: Eligibility Renewal and Retention
                        </h3>
                        <div className="question-container">
                          <fieldset className="ds-c-fieldset">
                            <div className="fill-form active">
                              <a
                                href="#same"
                                onClick={this.loadAnswers}
                                name="p1_q1"
                              >
                                Same as last year
                              </a>
                            </div>
                            <div className="clear-form">
                              <a
                                href="#same"
                                onClick={this.clearAnswers}
                                name="p1_q1"
                              >
                                Undo
                              </a>
                            </div>
                            <div className="question">
                              1. Do you have authority in your CHIP state plan
                              to provide for presumptive eligibility, and have
                              you implemented this?
                            </div>
                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                },
                                { label: "No", value: "no" },
                              ]}
                              className="ds-u-margin-top--0 p1_q1"
                              label=""
                              name="p1_q1"
                              onChange={this.setConditional}
                              hint="Note: This question may not apply to Medicaid Expansion states."
                            />
                            <div className="conditional hide">
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p1_q2"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p1_q2"
                            >
                              Undo
                            </a>
                          </div>
                          <div className="question">
                            2. Tell us how your state simplifies the eligibility
                            renewal process for families in order to retain more
                            children in CHIP.
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p1_q3"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p1_q3"
                            >
                              Undo
                            </a>
                          </div>
                          <div className="question">
                            3. Which retention strategies have been most
                            effective in your state?
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p1_q4"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p1_q4"
                            >
                              Undo
                            </a>
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p1_q5"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p1_q5"
                            >
                              Undo
                            </a>
                          </div>
                          <div className="question">
                            5. What data sources and methodology do you use for
                            tracking effectiveness?
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q1"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q1"
                            >
                              Undo
                            </a>
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q2"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q2"
                            >
                              Undo
                            </a>
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q3"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q3"
                            >
                              Undo
                            </a>
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
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q4"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q4"
                            >
                              Undo
                            </a>
                          </div>
                          <TextField
                            label="4. How many applicants were denied Title XXI coverage and determined eligible for Title XIX instead?"
                            labelClassName="ds-u-margin-top--0 p2_q4"
                            name="p2_q4"
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q5"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q5"
                            >
                              Undo
                            </a>
                          </div>
                          <TextField
                            label="5. How many applicants were denied Title XXI coverage for other reasons?"
                            labelClassName="ds-u-margin-top--0 p2_q5"
                            name="p2_q5"
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <div className="fill-form active">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p2_q6"
                            >
                              Same as last year
                            </a>
                          </div>
                          <div className="clear-form">
                            <a
                              href="#same"
                              onClick={this.clearAnswers}
                              name="p2_q6"
                            >
                              Undo
                            </a>
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
                  </TabPanel>
                  <TabPanel id="tab-lastyear" tab="FY2019 answers">
                    <form>
                      <div>
                        <h3 className="part-header">
                          Part 1: Eligibility Renewal and Retention
                        </h3>
                        <div className="question-container">
                          <fieldset className="ds-c-fieldset">
                            <div className="question">
                              1. Do you have authority in your CHIP state plan
                              to provide for presumptive eligibility, and have
                              you implemented this?
                            </div>
                            <ChoiceList
                              choices={[
                                {
                                  defaultChecked: true,
                                  label: "Yes",
                                  value: "yes",
                                  disabled: true,
                                },
                                { label: "No", value: "no", disabled: true },
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
                                value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                              />
                              <TextField
                                hint="Maximum 7,500 characters"
                                label="Of those children who are presumptively enrolled, what percentage are determined fully eligible and enrolled in the program?"
                                multiline
                                name="p1_q1__b"
                                rows="6"
                                value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                              />
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <div className="question">
                            2. Tell us how your state simplifies the eligibility
                            renewal process for families in order to retain more
                            children in CHIP.
                          </div>
                          <ChoiceList
                            choices={[
                              { label: "Yes", value: "yes", disabled: true },
                              {
                                label: "No",
                                value: "no",
                                defaultChecked: true,
                                disabled: true,
                              },
                            ]}
                            className="ds-u-margin-top--0"
                            label="a. Do you conduct follow-up communication with families through caseworkers and outreach workers?"
                            name="p1_q1__a"
                          />
                          <ChoiceList
                            choices={[
                              {
                                label: "Yes",
                                value: "yes",
                                defaultChecked: true,
                                disabled: true,
                              },
                              { label: "No", value: "no", disabled: true },
                            ]}
                            className="ds-u-margin-top--0"
                            label="b. Do you send renewal reminder notices to all families?"
                            name="p1_q1__b"
                          />
                          <TextField
                            label="c. How many notices do you send to families before disenrolling a child from the program?"
                            labelClassName="ds-u-margin-top--0 p1_q1__c"
                            name="p1_q1__c"
                            value="This is what you wrote last year."
                          />
                          <TextField
                            label="d. How many notices do you send to families before disenrolling a child from the program?"
                            labelClassName="ds-u-margin-top--0 p1_q1__d"
                            name="p1_q1__d"
                            value="This is what you wrote last year."
                          />
                          <TextField
                            label="e. What else do you do to simplify the eligibility renewal process for families in order to increase retention?"
                            labelClassName="ds-u-margin-top--0 p1_q1__e"
                            name="p1_q1__e"
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <div className="question">
                            3. Which retention strategies have been most
                            effective in your state?
                          </div>
                          <TextField
                            hint="Maximum 7,500 characters"
                            label=""
                            multiline
                            rows="6"
                            name="p1_q3"
                            value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
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
                            value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <div className="question">
                            5. What data sources and methodology do you use for
                            tracking effectiveness?
                          </div>
                          <TextField
                            hint="Maximum 7,500 characters"
                            label=""
                            multiline
                            rows="6"
                            name="p1_q5"
                            value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                          />
                        </fieldset>
                      </div>
                      <h3 className="part-header">Part 2: Eligibility Data</h3>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
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
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <TextField
                            hint="For example: an incomplete application, missing documentation, missing enrollment fee, etc."
                            label="2. How many applications were denied Title XXI coverage for procedural denials?"
                            labelClassName="ds-u-margin-top--0 p2_q2"
                            name="p2_q2"
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <TextField
                            hint="For example: income was too high, income was too low, they were determined Medicaid eligible instead, they had other coverage instead, etc."
                            label="3. How many applicants were denied Title XXI coverage for eligibility denials?"
                            labelClassName="ds-u-margin-top--0 p2_q3"
                            name="p2_q3"
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <TextField
                            label="4. How many applicants were denied Title XXI coverage and determined eligible for Title XIX instead?"
                            labelClassName="ds-u-margin-top--0 p2_q4"
                            name="p2_q4"
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <TextField
                            label="5. How many applicants were denied Title XXI coverage for other reasons?"
                            labelClassName="ds-u-margin-top--0 p2_q5"
                            name="p2_q5"
                            value="This is what you wrote last year."
                          />
                        </fieldset>
                      </div>
                      <div className="question-container">
                        <fieldset className="ds-c-fieldset">
                          <TextField
                            hint="(Maximum 7,500 characters)"
                            label="6. Did you run into any limitations when collecting data? Anything else you'd like to add about this section that wasn't already covered?"
                            labelClassName="ds-u-margin-top--0 p2_q6"
                            multiline
                            name="p2_q6"
                            rows="6"
                            value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
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
                  </TabPanel>
                </Tabs>
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
});

export default connect(mapStateToProps)(Section3c);
