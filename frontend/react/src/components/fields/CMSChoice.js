import React, { Component } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";

class CMSChoice extends Component {
  constructor(props) {
    super(props);

    this.sendData = this.sendData.bind(this);
  }

  sendData = (evt) => {
    this.props.onChange([evt.target.name, evt.target.value]);
  };

  render() {
    // Determine if choice is checked
    const isChecked = this.props.answer === this.props.value ? "checked" : null;

    // Create children based on field type
    let fields = [];

    // If there is a conditional
    if (this.props.conditional) {
      // If there is a conditional value AND children are specified
      if (
        this.props.conditional.includes(this.props.value) &&
        this.props.children
      ) {
        // Loop through subquestions
        this.props.children.map((item) => {
          // Set parent value to state, fallback to entered answer
          let parentValue = this.props.valueFromParent
            ? this.props.valueFromParent
            : this.props.answer;

          switch (item.type) {
            case "text_long":
              // Add to field to render array

              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                fields.push(
                  <>
                    <textarea
                      class="ds-c-field"
                      name={item.id}
                      value={item.answer.entry}
                      type="text"
                      name={item.id}
                      rows="6"
                    />
                  </>
                );
              }

              break;
            case "radio":
              // Loop through available answers object
              Object.entries(item.answer.options).map((key, index) => {
                // If entry matches current answer, mark as checked
                const isCheckedChild =
                  key[1] === item.answer.entry ? "checked" : null;

                // Add field to render array
                if (
                  parentValue === item.context_data.conditional_display.toMatch
                ) {
                  return fields.push(
                    <>
                      {index === 0 ? (
                        <legend className="ds-c-label">{item.label}</legend>
                      ) : null}
                      {/* Output only matching answers */}

                      <Choice
                        className="fpl-input"
                        name={item.id}
                        value={key[1]}
                        type="radio"
                        checked={isCheckedChild}
                      >
                        {key[0]}
                      </Choice>
                    </>
                  );
                }
              });
              break;
            case "ranges":
              // Add field to render array
              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                return fields.push(<FPL label={item.label} />);
              }
              break;
            case "money":
              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                fields.push(
                  <>
                    <TextField
                      className="fpl-input"
                      label={item.label}
                      inputMode="currency"
                      mask="currency"
                      pattern="[0-9]*"
                      value={item.answer.entry}
                    />
                  </>
                );
              }
              break;
          }
        });
      }
    }

    // Return Choice component after creating subquestion components
    return (
      <>
        <Choice
          class="ds-c-choice"
          name={this.props.name}
          value={this.props.value}
          type={this.props.type}
          checked={isChecked}
          checkedChildren={
            <div className="ds-c-choice__checkedChild">{fields}</div>
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
