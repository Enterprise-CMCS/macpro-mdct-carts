import React, { Component } from "react";
import { connect } from "react-redux";
// import Data from "../backend-json-section-3.json";
import FPL from "../layout/FPL";
import CMSChoice from "./CMSChoice";
import CMSLegend from "./CMSLegend";
import { TextField, Choice } from "@cmsgov/design-system-core";

import {
  generateMoneyField,
  generateRangeField,
  generateRadioCheckField,
  generateTextLongField,
} from "../Utils/questionUtils";

import shouldDisplay from "../Utils/helperFunctions";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt[0]]: evt[1],
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
  };

  render() {
    return (
      <>
        {this.props.data.map((question) =>
          question.context_data &&
          shouldDisplay(
            this.props.conditionalParentChoice,
            question.context_data
          ) ? (
            <div className="question">
              <fieldset className="ds-c-fieldset">
                {/* Generating question label */}
                <CMSLegend label={question.label} id={question.id} />
                {question.type === "radio" || question.type === "checkbox"
                  ? Object.entries(question.answer.options).map(
                      (key, index) => {
                        // let parentValue = this.props.valueFromParent
                        // ? this.props.valueFromParent
                        // : this.props.answer;

                        let input = this.state[question.id]
                          ? this.state[question.id]
                          : question.answer.entry;
                        return (
                          <CMSChoice
                            name={question.id}
                            value={key[1]}
                            label={key[0]}
                            type={question.type}
                            answer={question.answer.entry}
                            conditional={question.conditional}
                            children={question.questions}
                            valueFromParent={this.props.conditionalParentChoice}
                            //   onChange={this.handleChange}
                          />
                        );
                      }
                    )
                  : null}
                {/* If textarea */}
                {question.type === "text_long" ? (
                  <div>
                    <TextField
                      className="ds-c-field"
                      multiple
                      name={question.id}
                      value={question.answer.entry}
                      type="text"
                      name={question.id}
                      rows="6"
                      // onChange={this.props.sectionContext("some value")}
                    />
                  </div>
                ) : null}
                {/* If FPL Range */}
                {question.type === "ranges" ? (
                  <div>
                    <FPL label={question.label} />
                  </div>
                ) : null}
                {question.type === "integer" ? (
                  <div>
                    <TextField
                      // label={question.label}
                      className="ds-u-margin-top--0"
                      name="integer"
                      multiple
                    />
                  </div>
                ) : null}
                {/* If FPL Range */}
                {question.type === "file_upload" ? (
                  <div>
                    <TextField
                      // label={question.label}
                      className="ds-u-margin-top--0"
                      onChange={this.handleFileUpload}
                      name="fileUpload"
                      type="file"
                      multiple
                    />
                  </div>
                ) : null}
                {question.type === "money" ? (
                  <>
                    <TextField
                      className="fpl-input"
                      // label={item.label}
                      inputMode="currency"
                      mask="currency"
                      pattern="[0-9]*"
                      value={question.answer.entry}
                    />
                  </>
                ) : null}
                {question.questions ? (
                  <div>
                    {
                      <QuestionComponent
                        data={question.questions} //Array of subquestions to map through
                        sectionContext={this.props.sectionContext} // object with conditional conditions
                        conditionalParentChoice={question.answer.entry} // selection, if needed for children to know how to render
                        //   shouldDisplayProp={this.shouldDisplay(question.answer.entry, question.context_data)}
                      />
                    }
                  </div>
                ) : null}
                ) : (null )
              </fieldset>
            </div>
          ) : null
        )}
      </>
    );
  }
}

export default QuestionComponent;
