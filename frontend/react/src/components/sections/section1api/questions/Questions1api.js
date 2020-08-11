import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import Data from "./../backend-json-section-1.json";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import CMSHeader from "../../../fields/CMSHeader";

class Questions1 extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt[0]]: evt[1],
    });
  }

  render() {
    // Get state program (temporary; will be set by API)
    const stateProgram = this.props.programType; // medicaid_exp_chip, separate_chip, combo

    return (
      <form>
        {/* Begin parsing through subsection */}
        {Data.section.subsections.map((subsections) => (
          <div className="section">
            {/* Begin parsing through parts */}
            {subsections.parts.map((part) => (
              <div className="part">
                <CMSHeader title={part.title} id={part.id} type="Part" />

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
                          <CMSLegend
                            label={question.label}
                            id={question.id}
                            type="question"
                          />

                          {question.type === "radio" ||
                            question.type === "checkbox"
                            ? Object.entries(question.answer.options).map(
                              (key, index) => {
                                return (
                                  <CMSChoice
                                    name={question.id}
                                    value={key[1]}
                                    label={key[0]}
                                    type={question.type}
                                    answer={question.answer.entry}
                                    children={question.questions}
                                    valueFromParent={this.state[question.id]}
                                    onChange={this.handleChange}
                                  />
                                );
                              }
                            )
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
                              <FPL
                                fieldLabels={question.answer.range_categories}
                              />
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
}

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  year: state.global.formYear,
  programType: state.stateUser.programType,
});

export default connect(mapStateToProps)(Questions1);
