import React, { Component } from "react";
import Data from "../backend-json-section-3.json";

const sectionData = Data.section.subsections[5];
//JSON data starts on line 1071,
// it is an element in the subsections array

class Questions3FApi extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // Get state program (temporary; will be set by API)
    const stateProgram = "combo"; // medicaid_exp_chip, separate_chip, combo

    // console.log("whats in here??", sectionData.parts.length);

    // sectionF has only one part
    const section3FPart1 = sectionData.parts[0];
    const section3Ftitle = sectionData.title;
    console.log(
      "whats in the array",
      section3FPart1.context_data.show_if_state_program_type_in
    );
    return (
      <form>
        <div className="section">
          {!section3FPart1.context_data.show_if_state_program_type_in.includes(
            stateProgram
          ) ? (
            <div class="ds-c-alert ds-c-alert--hide-icon">
              <div class="ds-c-alert__body">
                <h3 class="ds-c-alert__heading">
                  {section3FPart1.context_data.skip_text}
                </h3>
              </div>
            </div>
          ) : (
            <div> whoop there it is </div>
          )}
        </div>
      </form>
    );
  }
}

export default Questions3FApi;
