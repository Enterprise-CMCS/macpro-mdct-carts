import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import {
  Tabs,
  TabPanel
} from "@cmsgov/design-system-core";
import FillForm from "../../layout/FillForm";
import QuestionsBasicInfo from "./questions/QuestionsBasicInfo";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fillFormTitle: "Same as last year",
    };
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });

    //Inline validation/error messaging for email and phone
    let errors = this.state.errors;

    switch (evt.target.name) {
      case "contactEmail":
        errors.email = validEmailRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid email";
        break;
      case "contactPhone":
        errors.phone = validTelephoneRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid 10 digit phone number";
        break;
      default:
        break;
    }
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */

  

  render() {
    return (
      <div className="section-basic-info ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab="Basic Information">
                <QuestionsBasicInfo previousYear='false'/>
                <FormNavigation nextUrl="/section1" />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <QuestionsBasicInfo previousYear='true'/>
                <FormNavigation nextUrl="/section1" />
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
