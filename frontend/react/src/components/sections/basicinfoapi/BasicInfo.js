import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import {
  Tabs,
  TabPanel
} from "@cmsgov/design-system-core";
import QuestionsBasicInfo from "./questions/QuestionsBasicInfo";
import Data from "./backend-json-section-0.json";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="section-basic-info ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={Data.section.title}>
                <QuestionsBasicInfo previousYear="false"/>
                <FormNavigation nextUrl="/section1" />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${Data.section.year - 1} answers`}
              >
                <div disabled>
                  <QuestionsBasicInfo previousYear="true"/>
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
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(BasicInfo);
