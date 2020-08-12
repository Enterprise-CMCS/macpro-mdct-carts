import React, { Component } from "react";
import { connect } from "react-redux";
import Data from "../backend-json-section-3.json";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import { TextField, Choice } from "@cmsgov/design-system-core";

const QuestionComponent = (props) => {
  return (
    <div className="section">
      {/* Begin parsing through parts */}

      {this.props.data.map((question) => (
        <div className="question">
          <fieldset className="ds-c-fieldset">
            <CMSLegend label={question.label} id={question.id} />

            {question.type === "radio" || question.type === "checkbox"
              ? Object.entries(question.answer.options).map((key, index) => {
                  return (
                    <CMSChoice
                      name={question.id}
                      value={key[1]}
                      label={key[0]}
                      type={question.type}
                      answer={question.answer.entry}
                      conditional={question.conditional}
                      children={question.questions}
                      valueFromParent={this.state[question.id]}
                      onChange={this.handleChange}
                    />
                  );
                })
              : null}

            {/* If textarea */}
            {question.type === "text_long" ? (
              <div>
                <textarea
                  class="ds-c-field"
                  name={question.id}
                  value={question.answer.entry}
                  type="text"
                  name={question.id}
                  rows="6"
                  onChange={this.props.sectionContext(
                    this.state.temporaryComponentID
                  )}
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

            {/*issue is at line 1144 */}

            {question.questions ? (
              <div>
                {
                  <Questions3FApi
                    data={question.questions}
                    sectionContext={
                      this.bindToParentContext
                        ? this.bindToParentContext
                        : this.props.sectionContext
                    }
                  />
                }
              </div>
            ) : null}
          </fieldset>
        </div>
      ))}
    </div>
  );
};
