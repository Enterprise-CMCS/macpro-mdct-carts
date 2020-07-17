import React, { Component, useState } from "react";
import Sidebar from "../../layout/Sidebar";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import { connect } from "react-redux";
import Questions3A from "./questions/Questions3A";
import "@reach/accordion/styles.css";
import FormActions from "../../layout/FormActions";
import {
  Button as button,
  Choice,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";

class Section3a extends Component {
  constructor(props) {
    super(props);
    const previousYearQuestions3A = <Questions3A 
    p1_q1 = "yes"
    p1_q1__a = "test 1 previous year"
    p1_q2 = "no"
    p1_q2__a = ""
    //p1_q2_array = {''}
    p1_q3 = "test 3 previous year"
    p1_q4 = "final test for last year"
    previousYear = "true"/>
    const thisYearQuestions3A = <Questions3A 
    p1_q1 = ""
    p1_q1__a = ""
    p1_q2 = ""
    p1_q2__a = ""
    p1_q3 = ""
    p1_q4 = ""
    previousYear = "false"
    previousp1_q1 = {previousYearQuestions3A.props.p1_q1}
    previousp1_q1__a = {previousYearQuestions3A.props.p1_q1__a}
    previousp1_q2 = {previousYearQuestions3A.props.p1_q2}
    previousp1_q2__a = {previousYearQuestions3A.props.p1_q2__a}
    previousp1_q3 = {previousYearQuestions3A.props.p1_q3}
    previousp1_q4 = {previousYearQuestions3A.props.p1_q4}
    />;
    this.state = {
      pageTitle: "Part 3a: Program Outreach",
      previousYearQuestions3AProp : previousYearQuestions3A,
      thisYearQuestions3AProp : thisYearQuestions3A 
    };
    this.setConditional = this.setConditional.bind(this);
  }

  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
  }
 

  render() {
    return (
      
      <div className="section-3a ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="print-only">
            <h3>{this.state.pageTitle}</h3>
          </div>
          <div className="section-content">
            <Tabs>
              <TabPanel
                id="tab-form"
                tab="Section 3A: Program Outreach"
              >
                {this.state.thisYearQuestions3AProp}
                <FormNavigation nextUrl="/section3/3c" previousUrl="/section2/2b" />
              </TabPanel>
              <TabPanel
              className="section3a-previous"
              tab={`FY${this.props.year - 1} answers`}
              >
                {this.state.previousYearQuestions3AProp}
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
  name: state.name,
  year: state.formYear,
});

export default connect(mapStateToProps)(Section3a);
