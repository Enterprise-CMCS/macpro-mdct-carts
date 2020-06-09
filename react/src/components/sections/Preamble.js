import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";

class Preamble extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
              <div className="ds-base">
                <h2> Preamble </h2>
                <div className="ds-base--inverse">
                  <div classname="preamble">
                    <p>
                      Completing the CHIP Annual Report Template System (CARTS)
                      is required under Title XXI, Section 2108(a) and Section
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Preamble;
