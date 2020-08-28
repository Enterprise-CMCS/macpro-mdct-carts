import React, { Component } from "react";
import { connect } from "react-redux";
import Questions2A from "./questions/Questions2Aapi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import QuestionComponent from "../../fields/QuestionComponent";
import {
  selectSectionByOrdinal,
  generateSubsectionLabel,
} from "../../../store/formData";

import {
  Button as button,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section2AApi extends Component {
  render() {
    console.log(this.props.Data);
    const subsectionData = this.props.Data
      ? this.props.Data.subsections[0] // 2A JSON Data
      : null;

    const sectionTitle = this.props.Data
      ? generateSubsectionLabel(subsectionData.id) // Section 3F title
      : null;
    console.log("SS", subsectionData);
    return subsectionData ? (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{sectionTitle}:</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={subsectionData.title}>
                <form>
                  {/* Begin parsing through parts */}
                  {subsectionData.parts.map((part) => (
                    <div className="part">
                      {part.title ? (
                        <h3 className="part-title">{part.title}</h3>
                      ) : null}
                      {/* Determine if question should be shown */}
                      <QuestionComponent
                        data={part.questions}
                        sectionContext={this.bindToParentContext}
                      />
                    </div>
                  ))}
                </form>
                <FormNavigation
                  nextUrl="/section2/2b"
                  previousUrl="/section1"
                />
              </TabPanel>

              {/* <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />
                  <h3>{subsectionData.title}</h3>
                </div>
                <div disabled>
                  <Questions2A previousEntry="true" />
                </div>
                <FormNavigation
                  nextUrl="/section2/2b"
                  previousUrl="/section1"
                />
              </TabPanel> */}
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  programType: state.stateUser.programType,
  year: state.global.formYear,
  Data: selectSectionByOrdinal(state, 2),
});

export default connect(mapStateToProps)(Section2AApi);
