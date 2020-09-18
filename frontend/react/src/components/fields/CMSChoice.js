import React, { Component } from "react";
import { Choice } from "@cmsgov/design-system-core";
import QuestionComponent from "../fields/QuestionComponent";

class CMSChoice extends Component {
  constructor(props) {
    super(props);

    this.sendData = this.sendData.bind(this);
  }

  sendData = (evt) => {
    // Add item to array
    let selections = [];
    selections.push(evt.target.value);

    // Set checkbox array of selected items
    // this.setState({ [evt.target.name]: selections });
    // Send event information back to parent component
    this.props.onChange([evt.target.name, evt.target.value], this.props.answer);
  };

  render() {
    const currentlySelected = this.props.answer; // question.answer.entry

    // Determine if choice is checked
    let isChecked = null;
    if (this.props.type === "checkbox") {
      if (Array.isArray(currentlySelected)) {
        isChecked = currentlySelected.includes(this.props.value)
          ? "checked"
          : null;
      } else {
        // Temporary, DELETE this once all checkbox entries are FOR SURE arrays
        isChecked = this.props.value === currentlySelected ? "checked" : null;
      }
    } else {
      // this.props.type is NOT checkbox (radio)
      isChecked = this.props.value === currentlySelected ? "checked" : null;
    }

    // Create children based on field type
    let fields = [];
    let tempQuestionHolder = [];

    // If there are children (question.questions)
    if (this.props.children) {
      // Loop through subquestions
      this.props.children.map((item) => {
        if (item.type === "fieldset") {
          item.questions.map((question) => {
            fields.push(
              <QuestionComponent
                data={[question]}
                setAnswer={this.props.setAnswer}
              />
            );
          });
        } else {
          tempQuestionHolder.push(item);
        }
      });

      if (tempQuestionHolder.length > 0) {
        fields.push(
          <QuestionComponent
            data={tempQuestionHolder}
            setAnswer={this.props.setAnswer}
          />
        );
      }

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
          disabled={this.props.disabledFromParent}
        >
          {this.props.label}
        </Choice>
      </>
    );
  }
}
export default CMSChoice;
