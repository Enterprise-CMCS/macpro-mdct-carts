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
    const section3FPart1 = sectionData.parts[0];
    const section3Ftitle = sectionData.title;
    const stateProgram = "combo"; // medicaid_exp_chip, separate_chip, combo

    // Get state program (temporary; will be set by API)

    // console.log("whats in here??", sectionData.parts.length);

    // sectionF has only one part
    let sectionID = sectionIDGrabber(sectionData.id);

    return (
      <form>
        <div className="section">
          <h3 className="part-title">
            {sectionID}: {sectionData.title}
          </h3>
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

function sectionIDGrabber(str) {
  let idArray = str.split("-");
  // let actualTitle = ""

  let sectionNumber = Number(idArray[1]);

  return `Section ${sectionNumber}${idArray[2].toUpperCase()}`;
}
