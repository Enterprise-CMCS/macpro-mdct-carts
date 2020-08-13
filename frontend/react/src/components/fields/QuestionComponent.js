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

import { shouldDisplay } from "../Utils/helperFunctions";

class QuestionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  handleChange(evtArr) {
    this.props.sectionContext(evtArr);
    this.setState({
      [evtArr[0]]: evtArr[1],
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
  };

  render() {
    let input;

    return (
      <>
        {this.props.data.map((question) => (
          <div className="question">
            <fieldset className="ds-c-fieldset">
              {/* Generating question label */}
              <CMSLegend label={question.label} id={question.id} />
              {question.type === "radio" || question.type === "checkbox"
                ? Object.entries(question.answer.options).map((key, index) => {
                    return (
                      <CMSChoice
                        name={question.id}
                        value={key[1]}
                        label={key[0]}
                        type={question.type}
                        answer={question.answer.entry} // JSON Answer
                        children={question.questions}
                        valueFromParent={this.state[question.id]} // User selection in local state
                        sectionContext={this.props.sectionContext}
                      />
                    );
                  })
                : null}
              {/* If textarea */}
              {question.type === "text_multiline" ? (
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
                      sectionContext={this.props.sectionContext} // function binding children to parent context
                    />
                  }
                </div>
              ) : null}
            </fieldset>
          </div>
        ))}
      </>
    );
  }
}

export default QuestionComponent;
