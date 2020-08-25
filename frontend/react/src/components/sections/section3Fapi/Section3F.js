import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormNavigation";
import QuestionComponent from "../../fields/QuestionComponent";
import {
  selectSectionByOrdinal,
  generateSubsectionLabel,
} from "../../../store/formData";

class Section3FApi extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.bindToParentContext = this.bindToParentContext.bind(this);
  }

  // Parent context function expects an array
  // evtArr[0] is the question ID
  // evtArr[1] is the payload, the question entry
  bindToParentContext(evtArr) {
    this.setState({
      lastChangedBy: evtArr[0],
      [evtArr[0]]: evtArr[1],
    });
  }
  render() {
    const subsectionData = this.props.Data
      ? this.props.Data.section.subsections[5] // 3F JSON Data
      : null;

    const sectionTitle = this.props.Data
      ? generateSubsectionLabel(subsectionData.id) // Section 3F title
      : null;

    return subsectionData ? (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{subsectionData.title}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={subsectionData.title}>
                <h3 className="part-title">
                  {sectionTitle}: {subsectionData.title}
                </h3>
                {/**
                 * Map through the parts array of the subsection
                 * data: Provide the part.questions array for the question component to map through
                 * sectionContext: Provide a method from the parent component to bind all answers to the parent context
                 */}
                {subsectionData.parts.map((part, index) => (
                  <QuestionComponent
                    data={part.questions}
                    sectionContext={this.bindToParentContext}
                    key={index}
                  />
                ))}
                <FormNavigation previousUrl="/section3/3c" />
              </TabPanel>

              {/* <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div className="print-only ly_header">
                  <PageInfo />
                  <h3>{this.props.section3FData.title}</h3>
                </div>
                <div disabled>
                  <h3 className="part-title">
                    {sectionID}: {this.props.section3FData.title}
                  </h3>
                  {this.props.section3FData.parts.map((part, index) => (
                    <QuestionComponent
                      previousEntry="true"
                      data={part.questions}
                      sectionContext={this.bindToParentContext}
                      key={index}
                    />
                  ))}
                </div>
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
  Data: selectSectionByOrdinal(state, 3),
  name: state.stateUser.name,
  year: state.global.formYear,
  programType: state.stateUser.programType,
});

export default connect(mapStateToProps)(Section3FApi);
