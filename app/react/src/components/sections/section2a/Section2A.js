import React, { Component } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";
import {
  Button as button,
  ChoiceList,
  TextField,
  Table,
} from "@cmsgov/design-system-core";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
class Section2a extends Component {
  constructor(props) {
    super(props);

    this.setConditional = this.setConditional.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      t1_m1: "284143",
      t1_m2: "300579",
      t1_s1: "478542",
      t1_s2: "511473",
      p1_q1: "",
      t2_y1_n1: "103",
      t2_y1_m1: "7.0",
      t2_y1_p1: "2.3",
      t2_y1_m2: ".2",
      t2_y2_n1: "86",
      t2_y2_m1: "7.0",
      t2_y2_p1: "2.0",
      t2_y2_m2: ".2",
      t2_y3_n1: "61",
      t2_y3_m1: "6.0",
      t2_y3_p1: "1.4",
      t2_y3_m2: ".1",
      t2_y4_n1: "58",
      t2_y4_m1: "7.0",
      t2_y4_p1: "1.3",
      t2_y4_m2: ".2",
      t2_y5_n1: "57",
      t2_y5_m1: "7.0",
      t2_y5_p1: "1.3",
      t2_y5_m2: ".2",
      p2_q1: "",
      p2_q2: "",
      p2_q2__a: "",
      p2_q3: "",
      p2_q3__a: "",
      p2_q3__b: "",
      p2_q3__c: "",
      p2_q3__d: "",
      p2_q3__e: "",
      p2_q3__f: "",
      p2_q3__g: "",
      p2_q3__h: "",
      p2_q4: "",
      fillFormTitle: "Same as last year",
      year1: this.props.formYear - 1,
      year2: this.props.formYear - 2,
      year3: this.props.formYear - 3,
      year4: this.props.formYear - 4,
    };
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
  }

  //Calculate the year over year percent change
  calcPercentChange(prevYear, currYear) {
    return ((currYear - prevYear) / prevYear) * 100;
  }

  render() {
    return (
      <div className="section-2a ds-l-col--9">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel
                id="section2b"
                tab="Section 2A: Enrollment and Uninsured Data"
              >
                <div className="section-content">
                  <form>
                    <div>
                      <h2 className="section-header"></h2>
                      <h3 className="part-header">
                        Part 1: Number of Children Enrolled in CHIP
                      </h3>
                      <p>
                        This table is pre-filled with your SEDS data for the two
                        most recent federal fiscal years. If the information is
                        inaccurate, adjust your data in SEDS (go to line 7:
                        “Unduplicated Number Ever Enrolled” in your fourth
                        quarter SEDS report) and refresh the page. There may be
                        a slight delay when updating data.
                      </p>

                      {/* SEDS Data Table */}
                      <table className="t1-seds-data-table" class="ds-c-table">
                        <thead>
                          <tr>
                            <th scope="col">Program</th>
                            <th scope="col">
                              Number of children enrolled (FFY{" "}
                              {this.state.year1})
                            </th>
                            <th scope="col">
                              Number of children enrolled (FFY{" "}
                              {this.props.formYear})
                            </th>
                            <th scope="col">Percent change</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">
                              M-CHIP (Medicaid Expansion Program)
                            </th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t1_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t1_m2}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.calcPercentChange(
                                  this.state.t1_m1,
                                  this.state.t1_m2
                                )}
                              />
                              %
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">S-CHIP (Separate CHIP Program)</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t1_s1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t1_s2}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.calcPercentChange(
                                  this.state.t1_s1,
                                  this.state.t1_s2
                                )}
                              />
                              %
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p></p>

                      <div>
                        {this.calcPercentChange(
                          this.state.t1_s1,
                          this.state.t1_s2
                        ) >= 10 ||
                        this.calcPercentChange(
                          this.state.t1_s1,
                          this.state.t1_s2
                        ) <= -10 ||
                        this.calcPercentChange(
                          this.state.t1_m1,
                          this.state.t1_m2
                        ) >= 10 ||
                        this.calcPercentChange(
                          this.state.t1_m1,
                          this.state.t1_m2
                        ) <= -10 ? (
                          <div className="conditional">
                            {/* Show if  M-CHIP or S-CHIP percent change(s) are more than a 10% change (increase or decrease) */}
                            <div className="question-container">
                              <div className="question">
                                1. What are some possible reasons why your state
                                had more than a 10% change in enrollment?
                              </div>
                              <TextField
                                hint="Maximum 7,500 characters"
                                label=""
                                multiline
                                rows="6"
                                name="p1_q1"
                                value={this.state.p1_q1}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Show if M-CHIP & S-CHIP percent changes are less than a 10% change */}
                            <p>
                              Since your percent change didn't exceed 10%, you
                              can skip to the next question.
                            </p>
                          </div>
                        )}
                      </div>

                      <h3 className="part-header">
                        Part 2: Number of Uninsured Children
                      </h3>
                      <p>
                        This table is pre-filled with data on uninsured children
                        (age 19 and under) who are below 200% of the Federal
                        Poverty Line (FPL) based on annual estimates from the
                        American Community Survey.
                      </p>

                      {/* American Community Survey Table
                    Tables with Irregular Headers: https://www.w3.org/WAI/tutorials/tables/irregular/ */}
                      <table
                        className="t2-american-community-survey-table"
                        class="ds-c-table"
                      >
                        <thead>
                          <colgroup span="1"></colgroup>
                          <colgroup span="2"></colgroup>
                          <colgroup span="2"></colgroup>
                          <tr>
                            <th scope="col" rowspan="2">
                              Year
                            </th>
                            <th scope="col" colspan="2" scope="colgroup">
                              Estimated number of uninsured children
                            </th>
                            <th scope="col" colspan="2" scope="colgroup">
                              Uninsured children as a percent of total children
                            </th>
                          </tr>
                          <tr>
                            <th scope="col">Number</th>
                            <th scope="col">Margin of error</th>
                            <th scope="col">Percent</th>
                            <th scope="col">Margin of error</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">{this.state.year4}</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y1_n1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y1_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.state.t2_y1_p1}
                              />
                              %
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y1_m2}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">{this.state.year3}</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y2_n1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y2_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.state.t2_y2_p1}
                              />
                              %
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y2_m2}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">{this.state.year2}</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y3_n1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y3_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.state.t2_y3_p1}
                              />
                              %
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y3_m2}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">{this.state.year1}</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y4_n1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y4_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.state.t2_y4_p1}
                              />
                              %
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y4_m2}
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">{this.props.formYear}</th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y5_n1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y5_m1}
                              />
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="2"
                                value={this.state.t2_y5_p1}
                              />
                              %
                            </td>
                            <td>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator={true}
                                value={this.state.t2_y5_m2}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p></p>
                      <table
                        className="t3-percent-change-table"
                        class="ds-c-table"
                      >
                        <tbody>
                          <tr>
                            <th scope="row">
                              Percent change between {this.state.year1} and{" "}
                              {this.props.formYear}
                            </th>
                            <td>
                              <NumberFormat
                                displayType="text"
                                decimalScale="1"
                                value={this.calcPercentChange(
                                  this.state.t2_y4_n1,
                                  this.state.t2_y5_n1
                                )}
                              />
                              %
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div>
                        {this.calcPercentChange(
                          this.state.t2_y4_n1,
                          this.state.t2_y5_n1
                        ) >= 10 ||
                        this.calcPercentChange(
                          this.state.t2_y4_n1,
                          this.state.t2_y5_n1
                        ) <= -10 ? (
                          <div className="conditional">
                            {/* Show if Number of Estimated number of uninsured children percent change is more than a 10% change (increase or decrease) */}
                            <div className="question-container">
                              <div className="question">
                                1. What are some possible reasons why your state
                                had more than a 10% change in enrollment?
                              </div>
                              <TextField
                                hint="Maximum 7,500 characters"
                                label=""
                                multiline
                                rows="6"
                                name="p2_q1"
                                value={this.state.p2_q1}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Show if Number of Estimated number of uninsured children percent change is less than a 10% change */}
                            <p>
                              Since your percent change didn't exceed 10%, you
                              can skip to the next question.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="question-container">
                        <div className="question">
                          2. Are there any reasons why the American Community
                          Survey estimates wouldn't be an accurate
                          representation of the number of uninsured children in
                          your state?
                        </div>
                        <div id="p2_q2">
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
                          {this.state.p2_q2 === "yes" ? (
                            <div className="conditional">
                              <TextField
                                label="a) What are some reasons why the American Community Survey estimates might not be accurate?"
                                multiline
                                name="p2_q2__a"
                                rows="6"
                                value={this.state.p2_q2__a}
                                onChange={this.handleChange}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="question-container">
                        <div className="question">
                          3. Do you have any alternate data source(s) or
                          methodology for measuring the number and/or percent of
                          uninsured children in your state?
                        </div>
                        <div id="p2_q3">
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
                          {this.state.p2_q3 === "yes" ? (
                            <div className="conditional">
                              <TextField
                                label="a) What is the alternate data source or methodology?"
                                multiline
                                name="p2_q3__a"
                                rows="6"
                                value={this.state.p2_q3__a}
                                onChange={this.handleChange}
                              />
                              <TextField
                                hint="(from mm/yyyy to mm/yyyy)"
                                label="b) Give a date range for your data"
                                multiline
                                name="p2_q3__b"
                                rows="1"
                                value={this.state.p2_q3__b}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="c) Define the population you’re measuring, including ages and federal poverty levels. "
                                multiline
                                name="p2_q3__c"
                                rows="6"
                                value={this.state.p2_q3__c}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="d) Give numbers and/or the percent of uninsured children for at least two points in time."
                                multiline
                                name="p2_q3__d"
                                rows="6"
                                value={this.state.p2_q3__d}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="e) Why did your state choose to adopt this alternate data source?"
                                multiline
                                name="p2_q3__e"
                                rows="6"
                                value={this.state.p2_q3__e}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="f) How reliable are these estimates? Provide standard errors, confidence intervals, and/or p-values if available."
                                multiline
                                name="p2_q3__f"
                                rows="6"
                                value={this.state.p2_q3__f}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="g) What are the limitations of this alternate data source or methodology?"
                                multiline
                                name="p2_q3__g"
                                rows="6"
                                value={this.state.p2_q3__g}
                                onChange={this.handleChange}
                              />
                              <TextField
                                label="h) How do you use this alternate data source in CHIP program planning?"
                                multiline
                                name="p2_q3__h"
                                rows="6"
                                value={this.state.p2_q3__h}
                                onChange={this.handleChange}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="question-container">
                        <div className="question">
                          4. Anything else you’d like to add about your data on
                          enrolled and uninsured children?
                        </div>
                        <TextField
                          hint="Maximum 7,500 characters"
                          label=""
                          multiline
                          rows="6"
                          name="p2_q4"
                          value={this.state.p2_q4}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <FormNavigation nextUrl="/2b" previousUrl="/1" />
              </TabPanel>
            </Tabs>
          </div>
          <FormActions />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  formName: state.formName,
  formYear: state.formYear,
});

export default connect(mapStateToProps)(Section2a);
