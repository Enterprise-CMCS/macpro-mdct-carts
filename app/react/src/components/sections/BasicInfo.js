import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="section-3c">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <dijhglv className="sidebar ds-l-col--3">
              <Sidebar />
            </dijhglv>

            <div className="main ds-l-col--9">
              <div className="ds-base">
                <h1> Mic check, 1-2, 1-2</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
