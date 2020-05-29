import React, { Component } from "react";
import Sidebar from "../Sidebar";
import Objective2b from "./objectives/Objective2b";

class Section2b extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stateInfo: {
        name: "New York",
        imageUri: process.env.PUBLIC_URL + "/img/new-york-temp.png",
      },
    };
  }
  render() {
    console.log("AYOOOOOO");

    return (
      <div class="section-2b">
        <div class="sidebar">
          <h1> SOME OUTPUT</h1>
          <Sidebar stateInfo={this.state.stateInfo} />
        </div>

        <div class="main">
          <div class="tabs section-tabs">
            <ul>
              <li>
                <a href="/2b">Section 2B: Performance Goals</a>
              </li>
              <li>
                <a href="#">FY2019 answers</a>
              </li>
            </ul>
          </div>
          <div class="section-content">
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
