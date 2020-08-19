import React, { Component } from "react";
import { Choice, TextField } from "@cmsgov/design-system-core";
import FPL from "../layout/FPL";
import CMSLegend from "../fields/CMSLegend";
import { shouldDisplay } from "../Utils/helperFunctions";
import CMSRanges from "./CMSRanges";

class CMSChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    // Bind functions for use throughout controller
    this.sendData = this.sendData.bind(this);
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

    // If children are specified
    if (this.props.children) {
      // Loop through subquestions
      this.props.children.map((item) => {
        // Set parent value to state, fallback to entered answer
        let parentValue = this.props.valueFromParent
          ? this.props.valueFromParent
          : this.props.answer;

        // Add fields to render array based on type (from api)
        switch (item.type) {
          case "text_long":
            // Check if question matches the currently selected option (from parent)
            if (shouldDisplay(parentValue, item.context_data)) {
              // Add to field to render array
              fields.push(
                <>
                  <CMSLegend
                    label={item.label}
                    id={item.id}
                    type="subquestion"
                  />
                  <TextField
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

              // Check if question matches the currently selected option (from parent)
              if (shouldDisplay(parentValue, item.context_data)) {
                // Add field to render array
                return fields.push(
                  <>
                    {index === 0 ? (
                      <CMSLegend
                        label={item.label}
                        id={item.id}
                        type="subquestion"
                      />
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
            // Check if question matches the currently selected option (from parent)

            // if (shouldDisplay(parentValue, item.context_data)) {
            // Add field to render array
            return fields.push(
              <>
                {/* <CMSRange item={item} mask="currency" numeric /> */}
                <CMSRanges item={item} />
              </>
            );
            // }
            break;
          case "money":
            // Check if question matches the currently selected option (from parent)

            if (shouldDisplay(parentValue, item.context_data)) {
              // Add field to render array
              fields.push(
                <>
                  <CMSLegend
                    label={item.label}
                    id={item.id}
                    type="subquestion"
                  />
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
          onChange={this.sendData}
        >
          {this.props.label}
        </Choice>
      </>
    );
  }
}

export default CMSChoice;
