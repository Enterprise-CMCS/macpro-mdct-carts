import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField, ChoiceList } from "@cmsgov/design-system-core";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
  } from "@reach/accordion";
  import FillForm from "../../../layout/FillForm";

class Questions3A extends Component {
  constructor(props) {
    super(props);
    this.state = {
        p1_q1: props.p1_q1,
        p1_q1__a: props.p1_q1__a,
        p1_q2: props.p1_q2,
        p1_q2__a: props.p1_q2__a,
        p1_q3:props.p1_q3,
        p1_q4:props.p1_q4,
        previousYear:this.props.previousYear,
        previousp1_q1: this.props.previousp1_q1,
        previousp1_q1__a: this.props.previousp1_q1__a,
        previousp1_q2: this.props.previousp1_q2,
        previousp1_q2__a: this.props.previousp1_q2__a,
        previousp1_q3:this.props.previousp1_q3,
        previousp1_q4:this.props.previousp1_q4,
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
  componentDidMount() {
    //
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
    let textFieldCopy = "";
    let textAreaCopy = "";

    // Boolean, Set values on active
    let isActive = el.target.classList.contains("active");

    const elementName = el.target.name;
    //This dynamically updates the element with last years response. Need to figure out a way to get all sub elements
    if (el.target.type === "TextField")
    {
        var newstate = {}; 
        newstate[el.target.id] = el.target.id; 
        if(el.target.title === "Undo")
        {
            
            this.setState({ [el.target.name]: this.state[el.target.name + 'temp']})
            el.target.title = "Active";
        }
        else{
            let tempElement = document.getElementsByName(elementName)
            this.setState({ [el.target.name + 'temp']: this.state[el.target.name] })
            this.setState({ [el.target.name]: this.state['previous'+el.target.name] })
            el.target.title = "Undo";
        }
        
        this.setState(newstate);
    }
    if (el.target.type === "RadioButton")
    {
        this.selectInput(elementName, 0, isActive);
        // Show/hide conditionals
        this.setConditionalFromToggle(el.target.name, isActive);
        this.setState({
            p1_q1: "yes",
            p1_q1__b: textAreaCopy,
            p1_q1__c: textAreaCopy,
        });
    }
    if (isActive) {
        
      }
    }

  
  render() {
      return(
          <form>
            <div>
              <div
                className="part1-all-questions-container"
                hidden={this.state.mchipDisable}
              >
                <div className="question-container">
                <FillForm
                    name="p1_q1"
                    title={this.state.fillFormTitle}
                    onClick={this.loadAnswers}
                />
                  <div id="p1_q1">
                    <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                      <legend className="ds-c-label">
                          1.	Have you changed your outreach methods in the last federal fiscal year?
                      </legend>

                      <ChoiceList
                        choices={[
                          {
                            label: "Yes",
                            value: "yes",
                            disabled: this.state.previousYear === "true" ? true : false,
                            defaultChecked:  this.state.p1_q1 ==="yes" ? true : false
                          },
                          {
                            label: "No",
                            value: "no",
                            disabled: this.state.previousYear === "true" ? true : false,
                            defaultChecked:  this.state.p1_q1 === "no" ? true : false
                          },
                        ]}
                        className="p1_q1"
                        label=""
                        name="p1_q1"
                        value={this.state.p1_q1}
                        onChange={this.setConditional}
                        
                      />
                    </fieldset>
                    {this.state.p1_q1 === "yes" ? (
                      <div className="conditional">
                        <TextField
                          label="a) What are you doing differently?"
                          name="p1_q1__a"
                          value={this.state.p1_q1__a}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="question-container">
                <FillForm
                    name="p1_q2"
                    title={this.state.fillFormTitle}
                    onClick={this.loadAnswers}
                />
                  <div id="p1_q2">
                    <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                      <legend className="ds-c-label"
                      >
                          2. Are you targeting specific populations in your outreach efforts?
                      </legend>
                      <ChoiceList
                        choices={[
                          {
                            label: "Yes",
                            value: "yes",
                            disabled: this.state.previousYear === "true" ? true : false,
                            defaultChecked:  this.state.p1_q2 ==="yes" ? true : false
                          },
                          {
                            label: "No",
                            value: "no",
                            disabled: this.state.previousYear === "true" ? true : false,
                            defaultChecked:  this.state.p1_q2 ==="no" ? true : false
                          },
                        ]}
                        className="p1_q2"
                        label=""
                        name="p1_q2"
                        value={this.state.p1_q2}
                        onChange={this.setConditional}
                        hint={"For example: minorities, immigrants, or children living in rural areas."}
                      />
                    </fieldset>
                    {this.state.p1_q2 === "yes" ? (
                      <div className="conditional">
                        <TextField
                          label="a) Have these efforts been successful? How have you measured the effectiveness of your outreach efforts?"
                          name="p1_q2__a"
                          value={this.state.p1_q2__a}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                   
                  </div>
                </div>
                <div className="question-container">
                <FillForm
                    name="p1_q3"
                    title={this.state.fillFormTitle}
                    onClick={this.loadAnswers}
                    type="TextField"
                />
                  <div id="p1_q3">
                    <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                      <TextField
                          label="3. What methods have been most effective in reaching low-income, uninsured children? "
                          name="p1_q3"
                          value={this.state.p1_q3}
                          hint={"For example: TV, school outreach, or word of mouth."}
                          onChange={this.changeText}
                        />
                    </fieldset>
                  </div>
                </div>
                <div className="question-container">
                <FillForm
                    name="p1_q4"
                    title={this.state.fillFormTitle}
                    onClick={this.loadAnswers}
                    type="TextField"
                />
                  <div id="p1_q4">
                    <fieldset className="ds-c-fieldset ds-u-margin-top--0">
                      <legend className="ds-c-label">
                      4.	Anything else you’d like to add about your outreach efforts?
                      </legend>
                      <TextField
                          name="p1_q4"
                          value={this.state.p1_q4}
                        />
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </form>
          )
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(Questions3A);
