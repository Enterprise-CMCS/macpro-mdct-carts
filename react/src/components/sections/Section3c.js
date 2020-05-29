import React, { Component } from "react";
import Sidebar from "../Sidebar";
import { connect } from "react-redux";

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
                <a href="#">FY2019 answers</a>
              </li>
            </ul>
          </div>
          <div className="section-content">
            <p>
              Your performance goals should match those reflected in your CHIP
              State Plan, Section 9. If your goals are different, submit a State
              Plan Amendment (SPA) to reconcile any differences
            </p>

            {/* <Objective2b /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Section3c;
