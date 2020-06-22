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
import FillForm from "../../layout/FillForm";
import NavigationButton from "../../layout/NavigationButtons";

class Section2a extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="section-2a">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <PageInfo />
              <div className="section-content">

                <form>
                  <div>
                    <h2 className="section-header">
                      Section 2A: Enrollment and Uninsured Data
                    </h2>
                    <h3 className="part-header">
                      Part 1: Number of Children Enrolled in CHIP
                    </h3>
                    <p>
                      This table is pre-filled with your SEDS data for the two most recent federal fiscal years. 
                      If the information is inaccurate, adjust your data in SEDS (go to line 7:  “Unduplicated Number Ever Enrolled” in your fourth quarter SEDS report) 
                      and refresh the page. There may be a slight delay when updating data.
                    </p>
                    {/* SEDS Data Table */}
                    <div className="seds-data-table">
                      <h4>SEDS DATA TABLE GOES HERE</h4>
                    </div>
                    {/* Show if  M-CHIP or S-CHIP percent change(s) are more than a 10% change (increase or decrease) */}
                    <div className="question-container">
                      <div className="question">
                        1. What are some possible reasons why your state had more than a 10% change in enrollment numbers? 
                      </div>
                      <TextField
                        hint="Maximum 7,500 characters"
                        label=""
                        multiline
                        rows="6"
                        name="p2_q2"
                        // value={this.state.p1_q1}
                      />
                    </div>
                    {/* Show if M-CHIP & S-CHIP percent changes are less than a 10% change */}
                    <div><p>Since your percent change didn't exceed 10%, you can skip to the next question.</p></div>

                    <h3 className="part-header">
                      Part 2: Number of Uninsured Children
                    </h3>
                    <p>
                      This table is pre-filled with data on uninsured children (age 19 and under) who are below 200% of the Federal Poverty Line (FPL) based on 
                      annual estimates from the American Community Survey. 
                    </p>
                    {/* American Community Survey Table */}
                    {/* Show if  M-CHIP or S-CHIP percent change(s) are more than a 10% change (increase or decrease) */}
                    <div className="seds-data-table">
                      <h4>AMERICAN COMMUNITY SURVEY TABLE GOES HERE</h4>
                    </div>
                    <div className="question-container">
                      <div className="question">
                        1. What are some possible reasons why your state had more than a 10% change in enrollment?
                      </div>
                      <TextField
                        hint="Maximum 7,500 characters"
                        label=""
                        multiline
                        rows="6"
                        name="p2_q1"
                        // value={this.state.p2_q1}
                      />
                    </div>
                    {/* Show if M-CHIP & S-CHIP percent changes are less than a 10% change */}
                    <div><p>Since your percent change didn't exceed 10%, you can skip to the next question.</p></div>

                    <div className="question-container">
                      <div className="question">
                        2. Are there any reasons why the American Community Surbey estimates wouldn't be an accurate representation of the number of uninsured children
                        in your state?
                      </div>
                      <TextField
                        hint="Maximum 7,500 characters"
                        label=""
                        multiline
                        rows="6"
                        name="p2_q2"
                        // value={this.state.p2_q2}
                      />
                    </div>

                    <div className="question-container">
                      <div className="question">
                        3. Do you have any alternate data source(s) or methodology for measuring the number and/or percent of uninsured children in your state?
                      </div>
                      <TextField
                        hint="Maximum 7,500 characters"
                        label=""
                        multiline
                        rows="6"
                        name="p2_q3"
                        // value={this.state.p2_q3}
                      />
                    </div>

                  </div>
                </form>

              </div>

              <div className="nav-buttons">
                <NavigationButton direction="Previous" destination="/basic-info" />

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
  
export default connect(mapStateToProps)(Section2a);