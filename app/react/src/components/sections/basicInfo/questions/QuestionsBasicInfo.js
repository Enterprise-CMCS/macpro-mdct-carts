import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
  } from "@reach/accordion";
  import {
    TextField,
    Dropdown,
    ChoiceList,
  } from "@cmsgov/design-system-core";
  import statesArray from "../../../Utils/statesArray";
  import FillForm from "../../../layout/FillForm";

class QuestionsBasicInfo extends Component {
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
      contactPhone: "",
      previous_programName: this.props.programName,
      previous_programType: this.props.programType,
      previous_contactName: "John Smith",
      previous_contactTitle: "NY CHIP Program Manager",
      previous_contactEmail: "jsmith@ny.gov",
      previous_contactAddress: "123 Main Street, Suite 456, New York, NY 78945",
      previous_contactPhone: "1234567890",
      errors: {
        email: "",
        phone: "",
      },
      previousYear: this.props.previousYear,
      fillFormTitle: "Same as last year"
    };
    this.setConditional = this.setConditional.bind(this)
    this.loadAnswers = this.loadAnswers.bind(this)
    this.selectInput = this.selectInput.bind(this)
    this.changeText = this.changeText.bind(this)
  }
  setConditional(el) {
    this.setState({
      [el.target.name]: el.target.value,
    });
  }
  changeText(event) {
    this.setState({ [event.target.name]: event.target.value });
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
  loadAnswers(el) {
    el.preventDefault();
    // button title: Undo or Same as Last year
    //el.target.title = this.state.fillFormTitle;

    el.target.classList.toggle("active");

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    const elementName = el.target.name;
    //This dynamically updates the element with last years response. Need to figure out a way to get all sub elements
    if (el.target.type === "textField")
    {
        var newstate = {}; 
        newstate[el.target.id] = el.target.id; 
        if(el.target.title === "Undo")
        {
            
            this.setState({ [el.target.name]: this.state[el.target.name + 'temp']})
            el.target.title = "Active";
        }
        else{
            this.setState({ [el.target.name + 'temp']: this.state[el.target.name] })
            this.setState({ [el.target.name]: this.state['previous_'+el.target.name] })
            el.target.title = "Undo";
        }
        
        this.setState(newstate);
    }
    
    }

  
  render() {
      return(
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
          value= {this.state.previousYear === "false" ? this.state.programName : this.state.previous_programName}
          onChange={this.handleChange}
          disabled
        />

        <div>
          <a href="mailto:cartshelp@cms.hhs.gov">
            If any of the above information is incorrect, contact
            CARTS Help Desk.
          </a>{" "}
        </div>

        <div>
          <h3>
            Who should we contact if we have any questions about your
            report?
          </h3>
          <div className="question-container">
          {this.props.previousYear === "false" &&
            <FillForm
              name="contactName"
              title={this.state.fillFormTitle}
              onClick={this.loadAnswers}
              type="textField"
            />
          }
            <TextField
              label="4. Contact name: "
              name="contactName"
              value= {this.state.previousYear === "false" ? this.state.contactName : this.state.previous_contactName}
              onChange={this.handleChange}
            />
          </div>
          <div className="question-container">
          {this.props.previousYear === "false" &&
            <FillForm
              name="contactTitle"
              title={this.state.fillFormTitle}
              onClick={this.loadAnswers}
              type="textField"
            />
          }
            <TextField
              label="5. Job title: "
              name="contactTitle"
              value= {this.state.previousYear === "false" ? this.state.contactTitle : this.state.previous_contactTitle}
              onChange={this.handleChange}
            />
          </div>
          <div className="question-container">
          {this.props.previousYear === "false" &&
            <FillForm
              name="contactEmail"
              title={this.state.fillFormTitle}
              onClick={this.loadAnswers}
              type="textField"
            />
          }
            <TextField
              type="email"
              label="6. Email: "
              name="contactEmail"
              value= {this.state.previousYear === "false" ? this.state.contactEmail : this.state.previous_contactEmail}
              onChange={this.handleChange}
            />
            {this.state.errors.email.length > 0 && (
              <span className="error">{this.state.errors.email}</span>
            )}
          </div>
          <div className="question-container">
          {this.props.previousYear === "false" &&
            <FillForm
              name="contactAddress"
              title={this.state.fillFormTitle}
              onClick={this.loadAnswers}
              type="textField"
            />
          }
            <TextField
              label="7. Full mailing address: "
              hint="Include city, state and zip code"
              name="contactAddress"
              multiline
              rows="4"
              value= {this.state.previousYear === "false" ? this.state.contactAddress : this.state.previous_contactAddress}
              onChange={this.handleChange}
            />
          </div>
          <div className="question-container">
          {this.props.previousYear === "false" &&
            <FillForm
              name="contactPhone"
              title={this.state.fillFormTitle}
              onClick={this.loadAnswers}
              type="textField"
            />
          }
            <TextField
              type="tel"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              label="8. Phone number: "
              name="contactPhone"
              mask="phone"
              value= {this.state.previousYear === "false" ? this.state.contactPhone : this.state.previous_contactPhone}
              onChange={this.handleChange}
            />
            {this.state.errors.phone.length > 0 && (
              <span className="error">{this.state.errors.phone}</span>
            )}
          </div>
        </div>
      </form>
          )
  }
}

const mapStateToProps = (state) => ({
  abbr: state.stateUser.currentUser.state.id,
  year: state.global.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(QuestionsBasicInfo);
