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
import FillForm from "../layout/FillForm";
import statesArray from "../Utils/statesArray";

class BasicInfo extends Component {
  constructor(props) {
    super(props);

    this.loadAnswers = this.loadAnswers.bind(this);
    this.selectInput = this.selectInput.bind(this);

    this.state = {
      selectedState: this.props.abbr,
      programName: this.props.programName,
      programType: this.props.programType,
      contactName: "",
      contactTitle: "",
      contactEmail: "",
      contactAddress: "",
      contactPhone: 0,
      fillFormTitle: "Same as last year",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  selectInput(id, option, active) {
    let selection = document.getElementById(id).getElementsByTagName("input");

    //clear any selections made by the user
    for (let input of selection) {
      input.checked = false;
    }

    if (active) {
      selection[option].checked = true;
    } else {
      for (let input of selection) {
        input.checked = false;
      }
    }
  }

  /**
   * If conditional value is triggered, set state to value
   * @param {Event} el
   */

  loadAnswers(el) {
    el.preventDefault();

    // button title: Undo or Same as Last year
    el.target.title = this.state.fillFormTitle;

    el.target.classList.toggle("active");
    let textFieldCopy = "";
    let textAreaCopy = "";

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    if (isActive) {
      textFieldCopy = "This is what you wrote last year.";
      textAreaCopy =
        "This is what you wrote last year.";
      el.target.title = "Undo";
    }

    switch (el.target.name) {
      case "contactName":
        this.setState({ contactName: textFieldCopy });
        break;
      case "contactTitle":
        this.setState({ contactTitle: textFieldCopy });
        break;
      case "contactEmail":
        this.setState({ contactEmail: textFieldCopy });
        break;
      case "contactAddress":
        this.setState({ contactAddress: textFieldCopy });
        break;
      case "contactPhone":
        this.setState({ contactPhone: textFieldCopy });
        break;
      default:
        break;
    }
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
                        <div className="question-container">
                          <FillForm
                            name="contactName"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
                          <TextField 
                            label="4. Contact name: " 
                            name="contactName" 
                            value={this.state.contactName}
                          />
                        </div>
                        <div className="question-container">
                          <FillForm
                            name="contactTitle"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
                          <TextField 
                            label="5. Job title: " 
                            name="contactTitle" 
                            value={this.state.contactTitle}
                          />
                        </div>
                        <div className="question-container">
                          <FillForm
                            name="contactEmail"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
                          <TextField
                            type="email"
                            label="6. Email: "
                            name="contactEmail"
                            value={this.state.contactEmail}
                          />
                        </div>
                        <div className="question-container">
                          <FillForm
                            name="contactAddress"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
                          <TextField
                            label="7. Full mailing address: "
                            hint="Include city, state and zip code"
                            name="contactAddress"
                            multiline
                            rows="4"
                            value={this.state.contactAddress}
                          />
                        </div>
                        <div className="question-container">
                          <FillForm
                            name="contactPhone"
                            title={this.state.fillFormTitle}
                            onClick={this.loadAnswers}
                          />
                          <TextField 
                            label="8. Phone number: " 
                            name="contactPhone" 
                            mask="phone"
                            value={this.state.contactPhone}
                          />
                        </div>
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
                        <h3>
                          Who should we contact if we have any questions about your
                          report?
                        </h3>
                        <TextField 
                          label="4. Contact name: " 
                          name="contactName" 
                          value="This is what you wrote last year."
                          disabled
                        />
                        <TextField 
                          label="5. Job title: " 
                          name="contactTitle" 
                          value="This is what you wrote last year."
                          disabled
                        />
                        <TextField
                          type="email"
                          label="6. Email: "
                          name="contactEmail"
                          value="This is what you wrote last year."
                          disabled
                        />
                        <TextField
                          label="7. Full mailing address: "
                          hint="Include city, state and zip code"
                          name="contactAddress"
                          multiline
                          rows="4"
                          value="This is what you wrote last year."
                          disabled
                        />
                        <TextField 
                          label="8. Phone number: " 
                          name="contactPhone"
                          value="This is what you wrote last year."
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
