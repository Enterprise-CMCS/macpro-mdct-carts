import React, { Component } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";
import CMSLegend from "../fields/CMSLegend";
import { shouldDisplay } from "../Utils/helperFunctions";
import CMSRanges from "./CMSRanges";
import QuestionComponent from "../fields/QuestionComponent";
import { setAnswerEntry } from "../../actions/initial";
import { connect } from "react-redux";

class CMSChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    // Bind functions for use throughout controller
    this.sendData = this.sendData.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
  }

  sendData = (evt) => {
    // Add item to array
    let selections = [];
    selections.push(evt.target.value);

    // Set checkbox array of selected items
    this.setState({ [evt.target.name]: selections });
    // Send event information back to parent component
    this.props.onChange([evt.target.name, evt.target.value]);
  };

  handleChangeArray(evtArray) {
    this.props.sectionContext([evtArray[0], evtArray[1]]);
    this.setState({
      [evtArray[0]]: evtArray[1] ? evtArray[1] : null,
      [evtArray[0] + "Mod"]: true,
    });
  }

  render() {
    // Get Current Value from state(passed from parent) or fall back to DB answer
    const currentValue = this.props.valueFromParent
      ? this.props.valueFromParent
      : this.props.answer;
    // Determine if choice is checked
    let isChecked = null;

    // Checkboxes manage their own checks, skip
    if (this.props.type === "checkbox") {
      if (Array.isArray(this.props.answer)) {
        // if value is in the answers array
        isChecked = this.props.answer.includes(
          this.state[this.props.name]
            ? this.state[this.props.name]
            : this.props.value
        )
          ? "checked"
          : null;
      }
    } else {
      isChecked = this.props.value === currentValue ? "checked" : null;
    }

    // Create children based on field type
    let fields = [];
    let tempQuestionHolder = [];

    // If children are specified
    if (this.props.children) {
      // Loop through subquestions
      this.props.children.map((item) => {
        // Set parent value to state, fallback to entered answer
        let parentValue = this.props.valueFromParent
          ? this.props.valueFromParent
          : this.props.answer;
        if (item.type === "fieldset") {
          item.questions.map((question) => {
            if (shouldDisplay(parentValue, item.context_data)) {
              fields.push(
                <QuestionComponent
                  data={[question]}
                  setAnswer={this.props.setAnswer}
                />
              );
            }
          });
        } else {
          if (shouldDisplay(parentValue, item.context_data)) {
            tempQuestionHolder.push(item);
          }
        }
        if (tempQuestionHolder.length > 0) {
          fields.push(
            <QuestionComponent
              data={tempQuestionHolder}
              setAnswer={this.props.setAnswer}
            />
          );
        }
      });

      // Return Choice component after creating subquestion components
    }
    return (
      <>
        <Choice
          name={this.props.name}
          value={this.props.value}
          type={this.props.type}
          checked={isChecked}
          checkedChildren={
            fields.length > 0 ? (
              <div className="ds-c-choice__checkedChild">{fields}</div>
            ) : null
          }
          onChange={this.sendData}
        >
          {this.props.label}
        </Choice>
      </>
    );
  }
}
export default CMSChoice;
