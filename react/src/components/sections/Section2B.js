import React, { Component } from "react";
import Sidebar from "../Sidebar";
import Objective2b from "./objectives/Objective2b";
import { connect } from "react-redux";

class Section2b extends Component {
  render() {
    console.log("NAME?", this.props.name);

    return (
      <div className="section-2b">
        <div className="sidebar">
          <h1> SOME OUTPUT</h1>
          <Sidebar />
        </div>

        <div className="main">
          <div className="tabs section-tabs">
            <ul>
              <li>
                <a href="/2b">Section 2B: Performance Goals</a>
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

            <Objective2b />
          </div>
        </div>
      </div>
    );
  }
}

export default Section2b;
