import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import NavigationButton from "../../layout/NavigationButtons";
import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

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
              <div className="section-content">
                <Tabs>
                  <TabPanel id="tab-form" tab="Section 3C: Eligibility">
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
                          <div id="p1_q1"></div>
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

                  <NavigationButton direction="Next" destination="/2b" />
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
});

export default connect(mapStateToProps)(Section1);
