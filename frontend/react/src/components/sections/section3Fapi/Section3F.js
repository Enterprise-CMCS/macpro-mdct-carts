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
import Questions3FApi from "./questions/Questions3FApi";

import QuestionComponent from "../../fields/QuestionComponent";

//JSON data starts on line 1071,
// it is an element in the subsections array
// const sectionData = Data.section.subsections[5];

class Section3FApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryComponentID: "Section 3F",
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
    let sectionID = sectionIDGrabber(this.props.section3FData.id);
    // console.log("Data from redux??", this.props.section3FData.parts[0].text);

    return (
      <div className="section-1 ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{this.props.section3FData.title}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab={this.props.section3FData.title}>
                <h3 className="part-title">
                  {sectionID}: {this.props.section3FData.title}
                </h3>
                {this.props.section3FData.parts.map((part, index) => (
                  <QuestionComponent
                    previousEntry="false"
                    data={part.questions}
                    sectionContext={this.bindToParentContext}
                    key={index}
                  />
                ))}
                <FormNavigation previousUrl="/section3/3c" />
              </TabPanel>

              <TabPanel
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
  section3FData: state.section3.questionData.section3FData,
});

export default connect(mapStateToProps)(Section3FApi);

// Temporary throwaway function, replaced by CMSHeader
function sectionIDGrabber(str) {
  let idArray = str.split("-");
  let sectionNumber = Number(idArray[1]);
  return `Section ${sectionNumber}${idArray[2].toUpperCase()}`;
}

// Map through the parts in the parent section.
// Give the questions component just an array of questions
