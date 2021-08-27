import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";
import PageInfo from "../layout/PageInfo";
import NavigationButton from "../layout/NavigationButtons";
import { Button as button } from "@cmsgov/design-system-core";

class Preamble extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="section-preamble">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9 content">
              <PageInfo />
              <div className="ds-base">
                <h4>Preamble</h4>
                <div className="preamble">
                  <p>
                    Completing the CHIP Annual Report Template System (CARTS) is
                    required under Title XXI, Section 2108(a) and Section
                    2108(e) of the Social Security Act.
                  </p>
                  <p>
                    Each state or territory must assess their CHIP (Children’s
                    Health Insurance Program) operations and their progress in
                    reducing the number of uninsured low-income children after
                    each federal fiscal year.
                  </p>
                  <p>
                    A state or territory must complete CARTS, including all
                    relevant sections to their program, by January 1.
                  </p>
                  <div className="preamble-carts-sections">
                    <h3>CARTS is organized into sections:</h3>
                    <ul>
                      <li>Your basic information</li>
                      <li>Section I: Program Fees and Policy Changes</li>
                      <li>Section 2: Eligibility and Enrollment</li>
                      <li>Section 3: Program Operations</li>
                      <li>Section 4: State Plan Goals and Objectives</li>
                      <li>Section 5: Budget and Finances</li>
                      <li>Section 6: Challenges and Accomplishments</li>
                    </ul>
                  </div>

                  <div className="preamble-framework-design">
                    <h3>The framework of CARTS is designed to:</h3>
                    <ul>
                      <li>
                        Recognize the diversity of each state and territory,
                        allowing for flexibility to highlight key
                        accomplishments and progress of individual CHIP programs
                      </li>

                      <li>
                        Recognize the diversity of each state and territory,
                        allowing for flexibility to highlight key
                        accomplishments and progress of individual CHIP programs
                      </li>

                      <li>
                        Build on data already collected by CMS in quarterly
                        reports
                      </li>

                      <li>
                        Make information about the achievements and challenges
                        of each state and territory more accessible to
                        stakeholders
                      </li>

                      <li>
                        Provide consistency in the structure, content, and
                        format of reporting across states and territories
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="nav-buttons">
                <NavigationButton direction="Next" destination="/basic-info" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Preamble;
