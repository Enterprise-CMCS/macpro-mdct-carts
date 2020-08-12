import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

import PageInfo from "../../layout/PageInfo";
import Data from "./backend-json-section-3.json";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormNavigation";
import Questions3AApi from "./questions/Questions3AApi";

//JSON data starts on line 1071,
// it is an element in the subsections array
const sectionData = Data.section.subsections[1];

class Section3AApi extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{sectionData.title}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={sectionData.title}>
                <Questions3AApi previousEntry="false" />
                <FormNavigation previousUrl="/section3/3c" />
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
                  <Questions3AApi previousEntry="true" />
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
  year: state.global.formYear,
  programType: state.stateUser.programType,
});

export default connect(mapStateToProps)(Section3AApi);
