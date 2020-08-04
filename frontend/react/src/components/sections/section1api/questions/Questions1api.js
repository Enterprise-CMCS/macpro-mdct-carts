import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import Data from "./../backend-json-section-1.json";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import { CMSChoice } from "../../../fields/CMSChoice";

function Questions1() {
  // Get state program (temporary; will be set by API)
  const stateProgram = "medicaid_exp_chip";

  let createChoices;
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
                part.questions.map((question) => (
                  <div className="question">
                    <fieldset className="ds-c-fieldset">
                      {question.label}
                      {question.type === "radio" || question.type === "checkbox"
                        ? Object.entries(question.answer.options).map(function (
                            key,
                            index
                          ) {
                            return (
                              <CMSChoice
                                name={question.id}
                                value={key[1]}
                                label={key[0]}
                                type={question.type}
                                answer={question.answer.entry}
                                conditional={question.conditional}
                                children={question.questions}
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
                          />
                        </div>
                      ) : null}
                      {/* If FPL Range */}
                      {question.type === "ranges" ? (
                        <div>
                          <FPL label={question.label} />
                        </div>
                      ) : null}
                    </fieldset>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions1);
