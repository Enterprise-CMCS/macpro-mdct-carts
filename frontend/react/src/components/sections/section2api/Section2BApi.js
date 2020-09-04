import React, { Component } from "react";
import { connect } from "react-redux";
import Questions2BApi from "./questions/Questions2Bapi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import {
  selectSectionByOrdinal,
  generateSubsectionLabel,
} from "../../../store/formData";

import {
  Button as button,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section2BApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectiveCount: 1,
      objectiveArray: [],
      previousObjectivesArray: [],
      pageTitle: "Section 2B: State Plan Goals and Objectives",
    };
    this.bindToParentContext = this.bindToParentContext.bind(this);
  }

  bindToParentContext(evtArr) {
    this.setState({
      parentHasBeenChanged: this.state.parentHasBeenChanged + 1,
      lastChangedBy: evtArr[0],
      [evtArr[0]]: evtArr[1],
    });
  }

  render() {
    // This variable narrows it down to a subsection
    const subsectionData = this.props.Data
      ? this.props.Data.subsections[1] // 2B JSON Data
      : null;

    const sectionTitle = this.props.Data
      ? generateSubsectionLabel(subsectionData.id) // Section 2b title
      : null;
    console.log("SubSec", subsectionData);
    return subsectionData ? (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{sectionTitle}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel
                id="tab-form"
                tab={`Section 2B:${subsectionData.title}`}
              >
                <Questions2BApi
                  previousEntry="false"
                  subsectionB={subsectionData} //[0].questions[0].questions
                />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />
                  <h3>{sectionTitle}</h3>
                </div>
                <div disabled>
                  {
                    //<Questions2BApi previousEntry="true" />
                  }
                </div>
              </TabPanel>
            </Tabs>

            <FormNavigation nextUrl="/section3/3a" previousUrl="/section2/2a" />

            <FormActions />
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  Data: selectSectionByOrdinal(state, 2),
  name: state.stateUser.name,
  programType: state.stateUser.programType,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section2BApi);
