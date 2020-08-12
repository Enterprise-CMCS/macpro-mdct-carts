import React, { Component } from "react";
import { connect } from "react-redux";
import Data from "../backend-json-section-3.json";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";
import CMSLegend from "../../../fields/CMSLegend";
import { TextField, Choice } from "@cmsgov/design-system-core";

// const sectionData = Data.section.subsections[5];
//JSON data starts on line 1071,
// it is an element in the subsections array

class Questions3FApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temporaryComponentID: "Questions 3F API",
    };
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
    // const section3FPart1 = this.props.data.parts[0];
    // const section3Ftitle = this.props.data.title;
    // const stateProgram = this.props.programType; // medicaid_exp_chip, separate_chip, combo

    // let sectionID = sectionIDGrabber(this.props.data.id);
    console.log("where is this function?", this);

    return (
      <form>
        {/* Begin parsing through subsection */}
        {/* {Data.section.subsections.map((subsections) => ( */}
        <div className="section">
          {/* Begin parsing through parts */}

          {this.props.data.map((question) => (
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
                            conditional={question.conditional}
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
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions3FApi);

// Temporary throwaway function, replaced by CMSHeader
function sectionIDGrabber(str) {
  let idArray = str.split("-");
  let sectionNumber = Number(idArray[1]);
  return `Section ${sectionNumber}${idArray[2].toUpperCase()}`;
}
