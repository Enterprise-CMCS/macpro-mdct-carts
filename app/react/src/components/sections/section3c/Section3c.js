import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";

class Section3c extends Component {
  constructor() {
    super();

    this.loadAnswers = this.loadAnswers.bind(this);
    this.setConditional = this.setConditional.bind(this);
    this.selectInput = this.selectInput.bind(this);
    this.setConditionalFromToggle = this.setConditionalFromToggle.bind(this);

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
    };
  }

  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    el.target.defaultChecked = true;
  }

  setConditionalFromToggle(name, value) {
    this.setState({
      name: value,
    });
  }

  selectInput(id, option, active) {
    let selection = document.getElementById(id).getElementsByTagName("input");
    if (active) {
      selection[option].checked = true;
    } else {
      for (let input of selection) {
        input.checked = false;
      }
    }
  }

  loadAnswers(el) {
    el.preventDefault();

    // button title: Undo or Same as Last year
    el.target.title = this.state.fillFormTitle;

    el.target.classList.toggle("active");
    let textFieldCopy = "";
    let textAreaCopy = "";

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    if (isActive) {
      textFieldCopy = "This is what you wrote last year.";
      textAreaCopy =
        "This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies.";
      el.target.title = "Undo";
    }

    switch (el.target.name) {
      case "p1_q1":
        this.selectInput(el.target.name, 0, isActive);
        this.setState({
          p1_q1: "yes",
          p1_q1__b: textAreaCopy,
          p1_q1__c: textAreaCopy,
        });

        // Show/hide conditionals
        this.setConditionalFromToggle(el.target.name, isActive);

        break;
      case "p1_q2":
        this.selectInput("p1_q2__a", 0, isActive);
        this.selectInput("p1_q2__b", 1, isActive);

        this.setState({
          p1_q2__c: textAreaCopy,
          p1_q2__d: textAreaCopy,
          p1_q2__e: textAreaCopy,
        });
        break;
      case "p1_q3":
        this.setState({ p1_q3: textAreaCopy });
        break;
      case "p1_q4":
        this.setState({ p1_q4: textAreaCopy });
        break;
      case "p1_q5":
        this.setState({ p1_q5: textAreaCopy });
        break;
      case "p2_q1":
        this.setState({ p2_q1: textFieldCopy });
        break;
      case "p2_q2":
        this.setState({ p2_q2: textFieldCopy });
        break;
      case "p2_q3":
        this.setState({ p2_q3: textFieldCopy });
        break;
      case "p2_q4":
        this.setState({ p2_q4: textFieldCopy });
        break;
      case "p2_q5":
        this.setState({ p2_q5: textFieldCopy });
        break;
      case "p2_q6":
        this.setState({ p2_q6: textAreaCopy });
        break;
      default:
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
              <PageInfo />
              <div className="section-content">
                <Tabs>
                  <TabPanel id="tab-form" tab="Section 3C: Eligibility">
                    <form>
                      <div>
                        <h3 className="part-header">
                          Part 1: Eligibility Renewal and Retention
                        </h3>
                        <div className="question-container">
                          <div className="fill-form">
                            <a
                              href="#same"
                              onClick={this.loadAnswers}
                              name="p1_q1"
                              title={this.state.fillFormTitle}
                            ></a>
                          </div>
                          <div className="question">
                            1. Do you have authority in your CHIP state plan to
                            provide for presumptive eligibility, and have you
                            implemented this?
                          </div>
                          <div id="p1_q1">
                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                  // defaultChecked: this.state.,
                                },
                                {
                                  label: "No",
                                  value: "no",
                                  // defaultChecked: false,
                                },
                              ]}
                              className="p1_q1"
                              label=""
                              name="p1_q1"
                              onChange={this.setConditional}
                              hint="Note: This question may not apply to Medicaid Expansion states."
                            />
                            {this.state.p1_q1 === "yes" ? (
                              <div className="conditional">
                                <TextField
                                  label="What percentage of children are presumptively enrolled in CHIP pending a full eligibility determination?"
                                  multiline
                                  name="p1_q1__b"
                                  rows="6"
                                  value={this.state.p1_q1__b}
                                />
                                <TextField
                                  hint="Maximum 7,500 characters"
                                  label="Of those children who are presumptively enrolled, what percentage are determined fully eligible and enrolled in the program?"
                                  multiline
                                  name="p1_q1__c"
                                  rows="6"
                                  value={this.state.p1_q1__c}
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p1_q2"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <div className="question">
                          2. Tell us how your state simplifies the eligibility
                          renewal process for families in order to retain more
                          children in CHIP.
                        </div>
                        <div className="sub-questions">
                          <div id="p1_q2__a">
                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                  checked: this.state.p1_q2__a_1,
                                },
                                {
                                  label: "No",
                                  value: "no",
                                  checked: this.state.p1_q2__a_2,
                                },
                              ]}
                              label="a. Do you conduct follow-up communication with families through caseworkers and outreach workers?"
                              name="p1_q2__a"
                            />
                          </div>
                          <div id="p1_q2__b">
                            <ChoiceList
                              choices={[
                                {
                                  label: "Yes",
                                  value: "yes",
                                  checked: this.state.p1_q2__b_1,
                                },
                                {
                                  label: "No",
                                  value: "no",
                                  checked: this.state.p1_q2__b_2,
                                },
                              ]}
                              label="b. Do you send renewal reminder notices to all families?"
                              name="p1_q2__b"
                            />
                          </div>
                          <TextField
                            label="c. How many notices do you send to families before disenrolling a child from the program?"
                            labelClassName="p1_q1__c"
                            name="p1_q2__c"
                            value={this.state.p1_q2__c}
                          />
                          <TextField
                            label="d. How many notices do you send to families before disenrolling a child from the program?"
                            labelClassName="p1_q1__d"
                            name="p1_q2__d"
                            value={this.state.p1_q2__d}
                          />
                          <TextField
                            label="e. What else do you do to simplify the eligibility renewal process for families in order to increase retention?"
                            labelClassName="p1_q1__e"
                            name="p1_q2__e"
                            value={this.state.p1_q2__e}
                          />
                        </div>
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p1_q3"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <div className="question">
                          3. Which retention strategies have been most effective
                          in your state?
                        </div>
                        <TextField
                          hint="Maximum 7,500 characters"
                          label=""
                          multiline
                          rows="6"
                          name="p1_q3"
                          value={this.state.p1_q3}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p1_q4"
                            title={this.state.fillFormTitle}
                            value={this.state.p1_q4}
                          ></a>
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
                          value={this.state.p1_q4}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p1_q5"
                            title={this.state.fillFormTitle}
                          ></a>
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
                          value={this.state.p1_q5}
                        />
                      </div>
                      <h3 className="part-header">Part 2: Eligibility Data</h3>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q1"
                            title={this.state.fillFormTitle}
                          ></a>
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
                          labelClassName="p2_q1"
                          name="p2_q1"
                          value={this.state.p2_q1}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q2"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <TextField
                          hint="For example: an incomplete application, missing documentation, missing enrollment fee, etc."
                          label="2. How many applications were denied Title XXI coverage for procedural denials?"
                          labelClassName="p2_q2"
                          name="p2_q2"
                          value={this.state.p2_q2}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q3"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <TextField
                          hint="For example: income was too high, income was too low, they were determined Medicaid eligible instead, they had other coverage instead, etc."
                          label="3. How many applicants were denied Title XXI coverage for eligibility denials?"
                          labelClassName="p2_q3"
                          name="p2_q3"
                          value={this.state.p2_q3}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q4"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <TextField
                          label="4. How many applicants were denied Title XXI coverage and determined eligible for Title XIX instead?"
                          labelClassName="p2_q4"
                          name="p2_q4"
                          value={this.state.p2_q4}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q5"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <TextField
                          label="5. How many applicants were denied Title XXI coverage for other reasons?"
                          labelClassName="p2_q5"
                          name="p2_q5"
                          value={this.state.p2_q5}
                        />
                      </div>
                      <div className="question-container">
                        <div className="fill-form">
                          <a
                            href="#same"
                            onClick={this.loadAnswers}
                            name="p2_q6"
                            title={this.state.fillFormTitle}
                          ></a>
                        </div>
                        <TextField
                          hint="(Maximum 7,500 characters)"
                          label="6. Did you run into any limitations when collecting data? Anything else you'd like to add about this section that wasn't already covered?"
                          labelClassName="p2_q6"
                          multiline
                          name="p2_q6"
                          rows="6"
                          value={this.state.p2_q6}
                        />
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
                          <div className="question">
                            1. Do you have authority in your CHIP state plan to
                            provide for presumptive eligibility, and have you
                            implemented this?
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
                            className="p1_q1"
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
                        </div>
                      </div>
                      <div className="question-container">
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
                          label="b. Do you send renewal reminder notices to all families?"
                          name="p1_q1__b"
                        />
                        <TextField
                          label="c. How many notices do you send to families before disenrolling a child from the program?"
                          labelClassName="p1_q1__c"
                          name="p1_q1__c"
                          value="This is what you wrote last year."
                        />
                        <TextField
                          label="d. How many notices do you send to families before disenrolling a child from the program?"
                          labelClassName="p1_q1__d"
                          name="p1_q1__d"
                          value="This is what you wrote last year."
                        />
                        <TextField
                          label="e. What else do you do to simplify the eligibility renewal process for families in order to increase retention?"
                          labelClassName="p1_q1__e"
                          name="p1_q1__e"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <div className="question">
                          3. Which retention strategies have been most effective
                          in your state?
                        </div>
                        <TextField
                          hint="Maximum 7,500 characters"
                          label=""
                          multiline
                          rows="6"
                          name="p1_q3"
                          value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                        />
                      </div>
                      <div className="question-container">
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
                      </div>
                      <div className="question-container">
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
                      </div>
                      <h3 className="part-header">Part 2: Eligibility Data</h3>
                      <div className="question-container">
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
                          labelClassName="p2_q1"
                          name="p2_q1"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <TextField
                          hint="For example: an incomplete application, missing documentation, missing enrollment fee, etc."
                          label="2. How many applications were denied Title XXI coverage for procedural denials?"
                          labelClassName="p2_q2"
                          name="p2_q2"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <TextField
                          hint="For example: income was too high, income was too low, they were determined Medicaid eligible instead, they had other coverage instead, etc."
                          label="3. How many applicants were denied Title XXI coverage for eligibility denials?"
                          labelClassName="p2_q3"
                          name="p2_q3"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <TextField
                          label="4. How many applicants were denied Title XXI coverage and determined eligible for Title XIX instead?"
                          labelClassName="p2_q4"
                          name="p2_q4"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <TextField
                          label="5. How many applicants were denied Title XXI coverage for other reasons?"
                          labelClassName="p2_q5"
                          name="p2_q5"
                          value="This is what you wrote last year."
                        />
                      </div>
                      <div className="question-container">
                        <TextField
                          hint="(Maximum 7,500 characters)"
                          label="6. Did you run into any limitations when collecting data? Anything else you'd like to add about this section that wasn't already covered?"
                          labelClassName="p2_q6"
                          multiline
                          name="p2_q6"
                          rows="6"
                          value="This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim. Quisque dignissim, libero eget rhoncus laoreet, justo tellus volutpat felis, in feugiat sem risus sed tellus. Suspendisse tincidunt nisl quis quam convallis condimentum auctor in dui. Pellentesque aliquet pellentesque metus id ultricies."
                        />
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
