import React, { Component } from "react";
import { connect } from "react-redux";
import Questions from "./questions/Questions3D.js";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import Data from "./backend-json-section-3.json";

import {
  Tabs,
  TabPanel,
} from "@cmsgov/design-system-core";

const sectionData = Data.section.subsections[3];

class Section3d extends Component {
 constructor(props) {
  super(props);
  this.state = {};
 }

  render() {
    return (
      <div className="section-3d ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{sectionData.title}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={sectionData.title}>
                <Questions previousEntry="false" />
                <FormNavigation
                  // nextUrl="/section2/2a"
                  previousUrl="/section3/3c"
                />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />
                  <h3>{sectionData.title}</h3>
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

export default connect(mapStateToProps)(Section3d);
