import React, { Component } from "react";
import { connect } from "react-redux";
import Questions from "./questions/Questions1api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import Data from "./backend-json-section-1.json";

import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryComponentID: "Section 1",
      parentHasBeenChanged: 0,
    };
    this.bindToParentContext = this.bindToParentContext.bind(this);
  }

  bindToParentContext(evtArr) {
    // Parent context function expects an array
    // evtArr[0] is the question ID
    // evtArr[1] is the payload, the question entry

    this.setState({
      parentHasBeenChanged: this.state.parentHasBeenChanged + 1,
      lastChangedBy: evtArr[0],
      [evtArr[0]]: evtArr[1],
    });
  }


  render() {
    return (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{Data.section.title}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={Data.section.title}>
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
                  <h3>{Data.section.title}</h3>
                </div>
                <div disabled>
                  <Questions previousEntry="true"
                    sectionContext={this.bindToParentContext} />
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
