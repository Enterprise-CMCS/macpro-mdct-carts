import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import Data from "./../backend-json-section-1.json";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import QuestionComponent from "../../../fields/QuestionComponent";

class Questions1 extends Component {
  constructor(props) {
    super(props);

    this.state = { temp: "Here is the original stuff" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    console.log("Handle Change occured", evt);
    this.setState({
      temp: "This has been changed",
      [evt[0]]: evt[1],
    });
  }

  render() {
    // Get state program (temporary; will be set by API)
    const stateProgram = "combo"; // medicaid_exp_chip, separate_chip, combo

    let valueFromParent;
    return (
      <form>
        {/* Begin parsing through subsection */}
        {Data.section.subsections.map((subsections) => (
          <div className="section">
            {/* Begin parsing through parts */}
            {subsections.parts.map((part) => (
              <div className="part">
                <h3 className="part-title">{part.title}</h3>

                {/* Determine if question should be shown */}
                {!part.context_data.show_if_state_program_type_in.includes(
                  stateProgram
                ) ? (
                    <div class="ds-c-alert ds-c-alert--hide-icon">
                      <div class="ds-c-alert__body">
                        <h3 class="ds-c-alert__heading">
                          {part.context_data.skip_text}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <QuestionComponent
                        data={part.questions}
                        sectionContext={this.props.sectionContext}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div >
        ))}
      </form >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    name: state.name,
    programType: state.programType,
    year: state.formYear,
  };
};

export default connect(mapStateToProps)(Questions1);
