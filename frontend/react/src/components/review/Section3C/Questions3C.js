import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField, ChoiceList, Choice } from "@cmsgov/design-system-core";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import FillForm from "../../layout/FillForm";

class Questions3C extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p1_q1: "no",
      p1_q1__a: "",
      p1_q1__a_1: "",
      p1_q1__a_2: "",
      p1_q1__b: "",
      p1_q2__a: "",
      p1_q2__b: "",
      p1_q2__c: "",
      p1_q2__d: "",
      p1_q2__e: "",
      p1_q3: "",
      p1_q4: "",
      p1_q5: "",
      p2_q1: "",
      p2_q2: "",
      p2_q3: "",
      p2_q4: "",
      p2_q5: "",
      p2_q6: "",
      previousYear:this.props.previousYear,
      previousp1_q3: "last year's text Q3",
      previousp1_q4: "last year's text q4",
      previousp1_q5: "last year's text q5",
      previousp2_q1: "last year's text q1",
      previousp2_q2: "last year's text q2",
      previousp2_q3: "last year's text q3",
      previousp2_q4: "last year's text q4",
      previousp2_q5: "last year's text q5",
      previousp2_q6: "last year's text q6",
      fillFormTitle: "Same as last year",
    };
    this.setConditional = this.setConditional.bind(this);
    this.loadAnswers = this.loadAnswers.bind(this);
    this.selectInput = this.selectInput.bind(this);
    this.changeText = this.changeText.bind(this);
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
    if (el.target.type === "textField") {
      var newstate = {};
      newstate[el.target.id] = el.target.id;
      if (el.target.title === "Undo") {
        this.setState({
          [el.target.name]: this.state[el.target.name + "temp"],
        });
        el.target.title = "Active";
      } else {
        this.setState({
          [el.target.name + "temp"]: this.state[el.target.name],
        });
        this.setState({
          [el.target.name]: this.state["previous" + el.target.name],
        });
        el.target.title = "Undo";
      }

      this.setState(newstate);
    }
  }

  render() {
    return (
      <form>
        <div>
          <h3 className="part-header">
            Part 1: Eligibility Renewal and Retention
          </h3>
          <div className="question-container">
            <div className="question">
              1. Do you have authority in your CHIP state plan to provide for
              presumptive eligibility, and have you implemented this?
            </div>
            <div id="p1_q1">
              {//<ChoiceList hint="Note: This question may not apply to Medicaid Expansion states."/>
              }
              <Choice 
                name="p1_q1" 
                type="radio" 
                value="yes"
                defaultChecked={this.props.previousEntry === "true" ? (this.state.previous_p1_q1 === "yes" ? true : false) : false}
                onChange={this.setConditional}
                >
                  Yes
                </Choice>

              <div className="conditional">
                <label className="ds-c-label">
                  What percentage of children are presumptively enrolled in CHIP
                  pending a full eligibility determination?
                </label>
                <div className="textfield">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  nec consequat orci. Aliquam posuere ligula urna, gravida
                  suscipit neque sodales quis. Morbi ultrices sapien placerat
                  fringilla bibendum. Vestibulum maximus augue lorem, quis
                  molestie massa varius vitae. Aenean sit amet massa eu augue
                  luctus ornare.
                </div>
                <label className="ds-c-label">
                  Of those children who are presumptively enrolled, what
                  percentage are determined fully eligible and enrolled in the
                  program?
                </label>
                <div className="textfield">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  nec consequat orci. Aliquam posuere ligula urna, gravida
                  suscipit neque sodales quis. Morbi ultrices sapien placerat
                  fringilla bibendum. Vestibulum maximus augue lorem, quis
                  molestie massa varius vitae. Aenean sit amet massa eu augue
                  luctus ornare.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            2. Tell us how your state simplifies the eligibility renewal process
            for families in order to retain more children in CHIP.
          </div>
          <div className="sub-questions">
            <div id="p1_q2__1">
              
              <Choice 
                name="p1_q2__1" 
                type="radio" 

                value="yes"
                defaultChecked={this.props.previousYear === "true" ? (this.state.previous_p1_q2__1 === "yes" ? true : false) : false}
                onChange={this.setConditional}
                >
                  Yes
                </Choice>
                <Choice 
                name="p1_q2__1" 
                type="radio" 
                value="no"
                defaultChecked={this.props.previousYear === "true" ? (this.state.previous_p1_q2__1 === "no" ? true : false) : false}
                onChange={this.setConditional}
                >
                  No
                </Choice>
            </div>
            <div id="p1_q2__2">
              {//<ChoiceList label="b. Do you send renewal reminder notices to all families?"/>
              }
              <Choice 
              name="p1_q2__2" 
              type="radio" 
              value="yes"
              defaultChecked={this.props.previousYear === "true" ? (this.state.previous_p1_q2__2 === "yes" ? true : false) : false}
              onChange={this.setConditional}
              >
                Yes
              </Choice>
              <Choice 
              name="p1_q2__2" 
              type="radio" 
              value="no"
              defaultChecked={this.props.previousYear === "true" ? (this.state.previous_p1_q2__2 === "no" ? true : false) : false}
              onChange={this.setConditional}
              >
                No
              </Choice>
            </div>
            <label className="ds-c-label">
              c. How many notices do you send to families before disenrolling a
              child from the program?
            </label>
            <div className="textfield">3</div>
            <label className="ds-c-label">
              d. How many notices do you send to families before disenrolling a
              child from the program?
            </label>
            <div className="textfield">6</div>

            <label className="ds-c-label">
              e. What else do you do to simplify the eligibility renewal process
              for families in order to increase retention?
            </label>
            <div className="textfield">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
              consequat orci. Aliquam posuere ligula urna, gravida suscipit
              neque sodales quis. Morbi ultrices sapien placerat fringilla
              bibendum. Vestibulum maximus augue lorem, quis molestie massa
              varius vitae. Aenean sit amet massa eu augue luctus ornare.
            </div>
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            3. Which retention strategies have been most effective in your
            state?
          </div>
          <div className="textfield">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
            consequat orci. Aliquam posuere ligula urna, gravida suscipit neque
            sodales quis. Morbi ultrices sapien placerat fringilla bibendum.
            Vestibulum maximus augue lorem, quis molestie massa varius vitae.
            Aenean sit amet massa eu augue luctus ornare.
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            4. How have you evaluated the effectiveness of your strategies?
          </div>
          <div className="textfield unanswered-text"></div>
        </div>
        <div className="question-container">
          <div className="question">
            5. What data sources and methodology do you use for tracking
            effectiveness?
          </div>
          <div className="textfield">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
            consequat orci. Aliquam posuere ligula urna, gravida suscipit neque
            sodales quis. Morbi ultrices sapien placerat fringilla bibendum.
            Vestibulum maximus augue lorem, quis molestie massa varius vitae.
            Aenean sit amet massa eu augue luctus ornare.
          </div>
        </div>
        <h3 className="part-header">Part 2: Eligibility Data</h3>
        <div className="question-container">
          <div className="question">
            A. Denials of Title XXI Coverage in FFY 2019
            <div className="hint">
              Enter your data below and the percentages will be automatically
              calculated in the final report.
            </div>
          </div>
          <legend className="ds-c-label">
            1. How many applicants were denied Title XXI coverage?
          </legend>
          <div className="textfield">2,890</div>
        </div>
        <div className="question-container">
          <legend className="ds-c-label">
            2. How many applications were denied Title XXI coverage for
            procedural denials?
          </legend>
          <div className="textfield">18</div>
        </div>
        <div className="question-container">
          <legend className="ds-c-label">
            3. How many applicants were denied Title XXI coverage for
            eligibility denials?
          </legend>
          <div className="textfield">7</div>
        </div>
        <div className="question-container">
          <legend className="ds-c-label">
            4. How many applicants were denied Title XXI coverage and determined
            eligible for Title XIX instead?
          </legend>
          <div className="textfield unanswered-text"></div>
        </div>
        <div className="question-container">
          <legend className="ds-c-label">
            5. How many applicants were denied Title XXI coverage for other
            reasons?
          </legend>
          <div className="textfield">12</div>
        </div>
        <div className="question-container">
          <legend className="ds-c-label">
            6. Did you run into any limitations when collecting data? Anything
            else you'd like to add about this section that wasn't already
            covered?
          </legend>
          <div className="textfield">584</div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions3C);
