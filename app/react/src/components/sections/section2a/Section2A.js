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

                    <h3 className="part-header">
                      Part 2: Number of Uninsured Children
                    </h3>
                    <p>
                      This table is pre-filled with data on uninsured children (age 19 and under) who are below 200% of the Federal Poverty Line (FPL) based on 
                      annual estimates from the American Community Survey. 
                    </p>
                    {/* American Community Survey Table */}

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