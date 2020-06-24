import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";
import PageInfo from "../layout/PageInfo";
import NavigationButton from "../layout/NavigationButtons";
import {
  TextField,
  Dropdown,
  ChoiceList,
  Button as button,
} from "@cmsgov/design-system-core";
import statesArray from "../Utils/statesArray";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: "AL",
      programName: "",
      programType: "",
      contactName: "",
      contactTitle: "",
      contactEmail: "",
      contactAddress: "",
      contactPhone: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  render() {
    return (
      <div className="section-basic-info">
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <PageInfo />
              <div className="ds-base">
                <h4> Welcome!</h4>
                <h3> Let’s start with your basic information. </h3>

                <form>
                  <Dropdown
                    label="1. State or territory name: "
                    size="medium"
                    name="selectedState"
                    options={statesArray}
                    value={this.state.selectedState}
                    onChange={this.handleChange}
                  />

                  <ChoiceList
                    choices={[
                      {
                        label: "Combination state (M-CHIP and S-CHIP)",
                        value: "comboCHIP",
                      },
                      {
                        label: "CHIP Medicaid Expansion only (M-CHIP)",
                        value: "mCHIP",
                      },
                      {
                        label: "CHIP Separate Program only (S-CHIP) ",
                        value: "sCHIP",
                      },
                    ]}
                    label="2. Program type: "
                    name="programType"
                    onChange={this.handleChange}
                  />

                  <TextField
                    label="3. CHIP program name(s): "
                    name="programName"
                    onChange={this.handleChange}
                  />

                  <div>
                    <h3>
                      Who should we contact if we have any questions about your
                      report?
                    </h3>
                    <TextField label="4. Contact Name: " name="contactName" />
                    <TextField label="5. Job Title: " name="contactTitle" />
                    <TextField
                      type="email"
                      label="6. Email: "
                      name="contactEmail"
                    />
                    <TextField
                      label="7. Address: "
                      hint="Include city, state and zip code"
                      name="contactAddress"
                    />
                    <TextField label="8. Phone Number: " name="contactPhone" />
                    <div className="form-options">
                      <button
                        type="submit"
                        className="ds-c-button ds-c-button--disabled"
                      >
                        Saved
                      </button>
                      <a href="#export" id="export">
                        Export
                      </a>
                    </div>
                  </div>

                  <div className="nav-buttons">
                    <NavigationButton
                      direction="Previous"
                      destination="/preamble"
                    />

                    <NavigationButton direction="Next" destination="/1" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
