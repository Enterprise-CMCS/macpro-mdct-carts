import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../layout/PageInfo";
import FormNavigation from "../layout/FormNavigation";
import FormActions from "../layout/FormActions";
import {
  TextField,
  Dropdown,
  ChoiceList,
  Tabs,
  TabPanel,
} from "@cmsgov/design-system-core";
import FillForm from "../layout/FillForm";
import statesArray from "../Utils/statesArray";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

class BasicInfo extends Component {
  constructor(props) {
    super(props);

    this.loadAnswers = this.loadAnswers.bind(this);

    this.state = {
      selectedState: this.props.abbr,
      programName: this.props.programName,
      programType: this.props.programType,
      contactName: "",
      contactTitle: "",
      contactEmail: "",
      contactAddress: "",
      contactPhone: 0,
      ly_programName: this.props.programName,
      ly_programType: this.props.programType,
      ly_contactName: "John Smith",
      ly_contactTitle: "NY CHIP Program Manager",
      ly_contactEmail: "jsmith@ny.gov",
      ly_contactAddress: "123 Main Street, Suite 456, New York, NY 78945",
      ly_contactPhone: "123-456-7890",
      errors: {
        email: "",
        phone: "",
      },
      fillFormTitle: "Same as last year",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    let errors = this.state.errors;

    this.setState({
      [evt.target.name]: evt.target.value,
    });

    //Inline validation/error messaging for email and phone
    switch (evt.target.name) {
      case "contactEmail":
        errors.email = validEmailRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid email";
        break;
      case "contactPhone":
        errors.phone = validTelephoneRegex.test(evt.target.value)
          ? ""
          : "Please enter a valid 10 digit phone number";
        break;
      default:
        break;
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

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    if (isActive) {
      el.target.title = "Undo";
    }

    if (isActive) {
      switch (el.target.name) {
        case "contactName":
          this.setState({ contactName: this.state.ly_contactName });
          break;
        case "contactTitle":
          this.setState({ contactTitle: this.state.ly_contactTitle });
          break;
        case "contactEmail":
          this.setState({ contactEmail: this.state.ly_contactEmail });
          break;
        case "contactAddress":
          this.setState({ contactAddress: this.state.ly_contactAddress });
          break;
        case "contactPhone":
          this.setState({ contactPhone: this.state.ly_contactPhone });
          break;
        default:
          break;
      }
    } else {
      this.setState({ [el.target.name]: "" });
    }
  }

  render() {
    return (
      <div className="section-basic-info ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab="Basic Information">
                <form>
                  <h3>Welcome!</h3>
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
                        checked:
                          this.state.programType === "comboCHIP" ? true : false,
                      },
                      {
                        label: "CHIP Medicaid Expansion only (M-CHIP)",
                        value: "mCHIP",
                        checked:
                          this.state.programType === "mCHIP" ? true : false,
                      },
                      {
                        label: "CHIP Separate Program only (S-CHIP) ",
                        value: "sCHIP",
                        checked:
                          this.state.programType === "sCHIP" ? true : false,
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
                    <a href="mailto:cartshelp@cms.hhs.gov">If any of the above information is incorrect, contact CARTS Help Desk.</a>{" "}
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
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
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
                        onBlur={this.handleChange}
                      />
                      {this.state.errors.email.length > 0 && (
                        <span className="error">{this.state.errors.email}</span>
                      )}
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
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="question-container">
                      <FillForm
                        name="contactPhone"
                        title={this.state.fillFormTitle}
                        onClick={this.loadAnswers}
                      />
                      <TextField
                        type="tel"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        label="8. Phone number: "
                        name="contactPhone"
                        mask="phone"
                        value={this.state.contactPhone}
                        onBlur={this.handleChange}
                      />
                      {this.state.errors.phone.length > 0 && (
                        <span className="error">{this.state.errors.phone}</span>
                      )}
                    </div>
                  </div>
                </form>
                <FormNavigation nextUrl="/section1" />
              </TabPanel>

              <TabPanel id="tab-lastyear" tab={`FY${this.props.year - 1} answers`}>
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
                        checked:
                          this.state.ly_programType === "comboCHIP" ? true : false,
                      },
                      {
                        label: "CHIP Medicaid Expansion only (M-CHIP)",
                        value: "mCHIP",
                        checked:
                          this.state.ly_programType === "mCHIP" ? true : false,
                      },
                      {
                        label: "CHIP Separate Program only (S-CHIP) ",
                        value: "sCHIP",
                        checked:
                          this.state.ly_programType === "sCHIP" ? true : false,
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
                    value={this.state.ly_programName}
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
                      name="ly_contactName"
                      value={this.state.ly_contactName}
                      disabled
                    />
                    <TextField
                      label="5. Job title: "
                      name="contactTitle"
                      value={this.state.ly_contactTitle}
                      disabled
                    />
                    <TextField
                      type="email"
                      label="6. Email: "
                      name="contactEmail"
                      value={this.state.ly_contactEmail}
                      disabled
                    />
                    <TextField
                      label="7. Full mailing address: "
                      hint="Include city, state and zip code"
                      name="contactAddress"
                      multiline
                      rows="4"
                      value={this.state.ly_contactAddress}
                      disabled
                    />
                    <TextField
                      label="8. Phone number: "
                      name="contactPhone"
                      value={this.state.ly_contactPhone}
                      disabled
                    />
                  </div>
                </form>
                <FormNavigation nextUrl="/section1" />
              </TabPanel>
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  abbr: state.abbr,
  year: state.formYear,
  programType: state.programType,
  programName: state.programName,
});

export default connect(mapStateToProps)(BasicInfo);
