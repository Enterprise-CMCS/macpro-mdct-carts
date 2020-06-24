import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import NavigationButton from "../../layout/NavigationButtons";

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
              <div className="section-content">Section 1</div>

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
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
});

export default connect(mapStateToProps)(Section1);
