import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import QuestionComponent from "../../../fields/QuestionComponent";

class Questions2A extends Component {
  constructor(props) {
    super(props);

    this.state = { temp: "Here is the original stuff" };

    this.handleChange = this.handleChange.bind(this);
    this.bindToParentContext = this.bindToParentContext.bind(this);
  }

  bindToParentContext(evtArr) {
    this.setState({
      parentHasBeenChanged: this.state.parentHasBeenChanged + 1,
      lastChangedBy: evtArr[0],
      [evtArr[0]]: evtArr[1],
    });
  }

  handleChange(evt) {
    this.setState({
      temp: "This has been changed",
      [evt[0]]: evt[1],
    });
  }

  render() {
    const stateProgram = "medicaid_exp_chip";
    let rowCount = 0;
    let createChoices;
    return console.log();
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions2A);
