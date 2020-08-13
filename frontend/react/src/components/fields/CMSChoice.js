import React, { Component } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";
import CMSLegend from "../fields/CMSLegend";

class CMSChoice extends Component {
  constructor(props) {
    super(props);

    // Bind functions for use throughout controller
    this.sendData = this.sendData.bind(this);
  }

  // Send event information back to parent component
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

          // Add fields to render array based on type (from api)
          switch (item.type) {
            case "text_long":
              // Check if question (toMatch) matches the currently selected option (parent)
              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                // Add to field to render array
                fields.push(
                  <>
                    <CMSLegend label={item.label} id={item.id} />
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
            case "checkbox":
              // Loop through available answers object
              Object.entries(item.answer.options).map((key, index) => {
                // If entry matches current answer, mark as checked
                const isCheckedChild =
                  key[1] === item.answer.entry ? "checked" : null;

                // Check if question (toMatch) matches the currently selected option (parent)
                if (
                  parentValue === item.context_data.conditional_display.toMatch
                ) {
                  // Add field to render array
                  return fields.push(
                    <>
                      {index === 0 ? (
                        <CMSLegend label={item.label} id={item.id} />
                      ) : null}
                      {/* Output only matching answers */}

                      <Choice
                        className="fpl-input"
                        name={item.id}
                        value={key[1]}
                        type={this.props.type}
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
              // Check if question (toMatch) matches the currently selected option (parent)

              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                // Add field to render array
                return fields.push(
                  <>
                    <CMSLegend label={item.label} id={item.id} />
                    <FPL />
                  </>
                );
              }
              break;
            case "money":
              // Check if question (toMatch) matches the currently selected option (parent)
              if (
                parentValue === item.context_data.conditional_display.toMatch
              ) {
                // Add field to render array
                fields.push(
                  <>
                    <CMSLegend label={item.label} id={item.id} />
                    <TextField
                      className="fpl-input"
                      // label={item.label}
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
            fields.length > 0 ? (
              <div className="ds-c-choice__checkedChild">{fields}</div>
            ) : null
          }
          disabled={this.props.disabled}
          onChange={this.sendData}
        >
          {this.props.label}
        </Choice>
      </>
    );
  }
}

export default CMSChoice;
