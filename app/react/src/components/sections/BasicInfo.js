import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Sidebar from "../layout/Sidebar";
import PageInfo from "../layout/PageInfo";
import NavigationButton from "../layout/NavigationButtons";
import {
  TextField,
  Dropdown,
  ChoiceList,
  Tabs,
  TabPanel,
  Button as button,
} from "@cmsgov/design-system-core";
import statesArray from "../Utils/statesArray";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: this.props.abbr,
      programName: this.props.programName,
      programType: this.props.programType,
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

                <Tabs>
                  <TabPanel id="tab-form" tab="Basic Information">
                    <form>
                      <Dropdown
                        label="1. State or territory name: "
                        size="medium"
                        name="selectedState"
                        options={statesArray}
                        value={this.state.selectedState}
                        onChange={this.handleChange}
                        disabled
                      />

                      <ChoiceList
                        choices={[
                          {
                            label: "Combination state (M-CHIP and S-CHIP)",
                            value: "comboCHIP",
                            checked: this.state.programType == "comboCHIP" ? true : false,
                          },
                          {
                            label: "CHIP Medicaid Expansion only (M-CHIP)",
                            value: "mCHIP",
                            checked: this.state.programType == "mCHIP" ? true : false,
                          },
                          {
                            label: "CHIP Separate Program only (S-CHIP) ",
                            value: "sCHIP",
                            checked: this.state.programType == "sCHIP" ? true : false,
                          },
                        ]}
                        label="2. Program type: "
                        name="programType"
                        onChange={this.handleChange}
                        disabled
                      />

                      <TextField
                        label="3. CHIP program name(s): "
                        name="programName"
                        value={this.state.programName}
                        onChange={this.handleChange}
                        disabled
                      />

                      <div>
                        <a href="mailto:cartshelp@cms.hhs.gov">This is incorrect</a>{" "}
                      </div>

                      <div>
                        <h3>
                          Who should we contact if we have any questions about your
                          report?
                        </h3>
                        <TextField label="4. Contact name: " name="contactName" />
                        <TextField label="5. Job title: " name="contactTitle" />
                        <TextField
                          type="email"
                          label="6. Email: "
                          name="contactEmail"
                        />
                        <TextField
                          label="7. Full mailing address: "
                          hint="Include city, state and zip code"
                          name="contactAddress"
                          multiline
                          rows="4"
                        />
                        <TextField label="8. Phone number: " name="contactPhone" />
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
                    </form>
                  </TabPanel>

                  <TabPanel id="tab-lastyear" tab="FY2019 answers">
                  <form>
                      <Dropdown
                        label="1. State or territory name: "
                        size="medium"
                        name="selectedState"
                        options={statesArray}
                        value={this.state.selectedState}
                        onChange={this.handleChange}
                        disabled
                      />

                      <ChoiceList
                        choices={[
                          {
                            label: "Combination state (M-CHIP and S-CHIP)",
                            value: "comboCHIP",
                            checked: this.state.programType == "comboCHIP" ? true : false,
                          },
                          {
                            label: "CHIP Medicaid Expansion only (M-CHIP)",
                            value: "mCHIP",
                            checked: this.state.programType == "mCHIP" ? true : false,
                          },
                          {
                            label: "CHIP Separate Program only (S-CHIP) ",
                            value: "sCHIP",
                            checked: this.state.programType == "sCHIP" ? true : false,
                          },
                        ]}
                        label="2. Program type: "
                        name="programType"
                        onChange={this.handleChange}
                        disabled
                      />

                      <TextField
                        label="3. CHIP program name(s): "
                        name="programName"
                        value={this.state.programName}
                        onChange={this.handleChange}
                        disabled
                      />

                      <div>
                        <a href="mailto:cartshelp@cms.hhs.gov">This is incorrect</a>{" "}
                      </div>

                      <div>
                        <h3>
                          Who should we contact if we have any questions about your
                          report?
                        </h3>
                        <TextField 
                          label="4. Contact name: " 
                          name="contactName" 
                          value="John Smith"
                          disabled
                        />
                        <TextField 
                          label="5. Job title: " 
                          name="contactTitle" 
                          value="State CHIP Program Manager"
                          disabled
                        />
                        <TextField
                          type="email"
                          label="6. Email: "
                          name="contactEmail"
                          value="jsmith@ny.gov"
                          disabled
                        />
                        <TextField
                          label="7. Full mailing address: "
                          hint="Include city, state and zip code"
                          name="contactAddress"
                          multiline
                          rows="4"
                          value="123 Main Street
                          Suite 456
                          New York, NY 78945"
                          disabled
                        />
                        <TextField 
                          label="8. Phone number: " 
                          name="contactPhone"
                          value="123-456-7890"
                          disabled
                        />
                      </div>
                    </form>
                  </TabPanel>
                </Tabs>

                <div className="nav-buttons">
                  <NavigationButton direction="Next" destination="/1" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  abbr: state.abbr,
  programType: state.programType,
  programName: state.programName,
});

export default connect(mapStateToProps)(BasicInfo);
