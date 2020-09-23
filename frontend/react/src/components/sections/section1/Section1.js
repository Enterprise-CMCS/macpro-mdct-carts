import React, { Component } from "react";
import { connect } from "react-redux";
import Questions from "./questions/Questions1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import {
  Button as button,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTitle: "Section 1: Program Fees and Policy Changes",
    };
  }

  render() {
    return (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{this.state.pageTitle}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={this.state.pageTitle}>
                <Questions previousEntry="false" />
                <FormNavigation
                  nextUrl="/section2/2a"
                  previousUrl="/basic-info"
                />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />
                  <h3>{this.state.pageTitle}</h3>
                </div>
                <div disabled>
                  <Questions previousEntry="true" />
                </div>
              </TabPanel>
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  programType: state.stateUser.programType,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section1);
