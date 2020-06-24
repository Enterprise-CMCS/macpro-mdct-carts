import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import NavigationButton from "../../layout/NavigationButtons";

class Section1 extends Component {
  constructor() {
    super();
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
              <div className="section-content"><Tabs>
                  <TabPanel id="tab-form" tab="Section 3C: Eligibility">
                    <form>
                      <div>
                        <h3 className="part-header">
                          Part 1: Eligibility Renewal and Retention
                        </h3>
                        <div className="question-container">
                          <FillForm
                            name="p1_q1"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
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

              <div className="nav-buttons">
                <NavigationButton
                  direction="Previous"
                  destination="/basic-info"
                />

                <NavigationButton direction="Next" destination="/2b" />
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

export default connect(mapStateToProps)(Section1);
