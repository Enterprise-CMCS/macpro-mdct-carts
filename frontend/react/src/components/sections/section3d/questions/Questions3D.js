import React, { Component } from "react";
import { connect } from "react-redux";
import Data from "../backend-json-section-3.json";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import { TextField } from "@cmsgov/design-system-core";

// Get subsection of DATA
const sectionData = Data.section.subsections[3];

class Questions3d extends Component {
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
    const stateProgram = this.props.programType; // medicaid_exp_chip, separate_chip, combo

    return (
      <form>
        {/* Begin parsing through subsection */}
        <div className="section">
          {/* Begin parsing through parts */}
          {sectionData.parts.map((part) => (
            <div className="part">
              <h3 className="part-title">{part.title}</h3>

              {part.questions.map((question) => (
                <div className="question">
                  <fieldset className="ds-c-fieldset">
                    <CMSLegend label={question.label} id={question.id} />

                    {question.type === "radio" || question.type === "checkbox"
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
                              key={index}
                            />
                          );
                        }
                      )
                      : null}

                    {/* If textarea */}
                    {question.type === "text_multiline" ? (
                      <div>
                        <TextField
                          class="ds-c-field"
                          name={question.id}
                          value={question.answer.entry || ""}
                          type="text"
                          name={question.id}
                          rows="6"
                          multiline
                        />
                      </div>
                    ) : null}
                    {/* If FPL Range */}
                    {question.type === "ranges" && (
                      <FPL label={question.label} fieldLabels={question.answer.range_categories} />
                    )}
                  </fieldset>
                </div>
              ))}
            </div>
          ))}
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions3d);