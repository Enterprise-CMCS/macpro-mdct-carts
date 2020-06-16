import React, { Component, Fragment } from "react";
import Sidebar from "../layout/Sidebar";
import { TextField, Dropdown, ChoiceList } from "@cmsgov/design-system-core";
import statesArray from "../Utils/statesArray";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: "NY",
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
              <div className="ds-base">
                <h1> Welcome!</h1>
                <h3> Let’s start with your basic information. </h3>

                <Dropdown
                  label="1. State or territory name"
                  size="medium"
                  name="selectedState"
                  options={statesArray}
                  value={this.state.selectedState}
                  onChange={this.handleChange}
                />
                <TextField
                  label="2. CHIP program name(s):"
                  name="programName"
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
                  label="3. Program Type: "
                  name="programType"
                  onChange={this.handleChange}
                />

                <h3>
                  {" "}
                  Who should we contact if we have any questions about your
                  report? <TextField label="Contact name" name="contactName" />
                  <TextField label="Job title" name="contactTitle" />
                  <TextField label="Email" name="contactEmail" />
                  <TextField
                    label="Address"
                    hint="Office address"
                    name="contactAddress"
                  />
                  <TextField label="Phone Number" name="contactPhone" />
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
