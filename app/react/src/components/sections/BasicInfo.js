import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="section-basic-info">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <div className="ds-base">
                <h1> Welcome!</h1>
                <h3> Let’s start with your basic information. </h3>

                <h3>
                  {" "}
                  Who should we contact if we have any questions about your
                  report?{" "}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
