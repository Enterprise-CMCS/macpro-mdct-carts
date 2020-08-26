import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import Data from "./../backend-json-section-2.json";
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
    return (
      < form >
        {/* Begin parsing through subsection */}
        {
          Data.section.subsections.map((subsections) => (
            <div className="section">
              {subsections.id === "2020-02-a" ?
                <>
                  {/* Begin parsing through parts */}
                  {subsections.parts.map((part) => (
                    <div className="part">
                      {part.title ?
                        (<h3 className="part-title">{part.title}</h3>)
                        : null}
                      {/* Determine if question should be shown */}
                      <QuestionComponent data={part.questions}
                        sectionContext={this.bindToParentContext} />
                    </div>
                  ))}
                </> : null}
            </div>
          ))
        }
      </form >
    )
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions2A);
