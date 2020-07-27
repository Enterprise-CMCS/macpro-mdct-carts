import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Choice,
  ChoiceList,
  Tabs,
  TabPanel,
  TextField,
} from "@cmsgov/design-system-core";
import PageInfo from "../layout/PageInfo";
import FillForm from "../layout/FillForm";
import FormNavigation from "../layout/FormNavigation";
import FormActions from "../layout/FormActions";
import Questions3C from "./Section3C/Questions3C";
class Section3c extends Component {
  constructor() {
    super();

    this.setConditional = this.setConditional.bind(this);
    this.setConditionalFromToggle = this.setConditionalFromToggle.bind(this);

    this.state = {
      fillFormTitle: "Same as last year",
      pageTitle: "Section 3C: Eligibility",
    };
  }

  // Allows updating text when value is set to state
  changeText(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
    // el.target.defaultChecked = true;
  }

  setConditionalFromToggle(name, value) {
    this.setState({
      name: value,
    });
  }

  render() {
    return (
      <div className="section-3c ds-l-col--9 content">
        <div className="main">
          <h2>{this.state.pageTitle}</h2>
          <div className="section-content">
            <Questions3C />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Section3c);
