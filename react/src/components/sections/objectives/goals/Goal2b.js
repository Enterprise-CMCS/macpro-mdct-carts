import React, { Component, Fragment } from "react";
import { TextField, ChoiceList, DateField } from "@cmsgov/design-system-core";
import Accordion from "react-bootstrap/Accordion";

class Goal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal_numerator_digit: 0,
      goal_denominator_digit: 0,
      percentage: 0,
    };
    this.percentageCalculator = this.percentageCalculator.bind(this);
  }

  percentageCalculator(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
      percentage:
        this.state.goal_numerator_digit / this.state.goal_denominator_digit,
    });
  }

  render() {
    return (
      <Fragment>
        <div className="question-container">
          <TextField
            label="Briefly describe your goal"
            hint="For example: Our goal is to enroll 75% of CHIP-eligible children with family income below 247% of the federal poverty level"
            multiline
            name="goal_description"
          />
        </div>

        <div className="question-container">
          <ChoiceList
            choices={[
              { label: "New goal", value: "new" },
              { label: "Continuing goal", value: "continuing" },
              { label: "Discontinued goal", value: "discontinued" },
            ]}
            label="What type of goal is it?"
            name="goal_type"
          />
        </div>

        <div className="question-container">
          <TextField
            label="What measurement will you use to track this goal?"
            hint="For example: We'll measure the percent of eligible children who enrolled in CHIP"
            multiline
            name="goal_measurement"
          />
        </div>

        <div className="question-container">
          <h3 className="question"> Define the numerator you're measuring</h3>

          <TextField
            label="How do you define this population?"
            hint="For example: The number of children below 247% of the FPL who enrolled in CHIP in the last federal fiscal year."
            multiline
            name="goal_numerator_definition"
          />

          <TextField
            label="Numerator"
            hint="Total number"
            name="goal_numerator_digit"
            size="medium"
            onChange={this.percentageCalculator}
          />
          <h4> Define the denominator you're measuring</h4>
          <TextField
            label="How do you define this population?"
            hint="For example: The total number of children below 247% of the FPL in the last federal fiscal year."
            multiline
            name="goal_denominator_definition"
          />

          <TextField
            label="Denominator"
            hint="Total number"
            name="goal_denominator_digit"
            size="medium"
            onChange={this.percentageCalculator}
          />
        </div>

        <div className="ds-u-border--2">
          <form>
            <div className="ds-1-row percentages-info">
              <div className="ds-l--auto">
                <h3>Percentage</h3>
                <h4>Auto-calculated</h4>
              </div>
            </div>
            <div className="ds-1-row percentages">
              <div>
                <TextField
                  label="Numerator"
                  name="goal_numerator_digit"
                  size="small"
                  value={this.state.goal_numerator_digit}
                  className="ds-l--auto"
                />
              </div>
              <div>
                <div className="divide">&divide;</div>
                <TextField
                  label="Denominator"
                  name="goal_denominator_digit"
                  size="small"
                  value={this.state.goal_denominator_digit}
                  className="ds-l--auto"
                />
              </div>
              <div>
                <div className="divide"> &#61; </div>
                <TextField
                  label="Percentage"
                  name="goal_percentage"
                  size="small"
                  value={`${
                    this.state.goal_numerator_digit /
                    this.state.goal_denominator_digit
                  }%`}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="question-container">
          <h4> What is the date range for your data?</h4>
          <div className="date-range">
            <DateField
              label="Start"
              hint={"From mm/yyyy to mm/yyyy"}
              monthValue={12}
              yearValue={1999}
              dayDefaultValue={null}
            />

            <DateField
              label="End"
              hint={"From mm/yyyy to mm/yyyy"}
              monthValue={12}
              yearValue={1999}
              dayDefaultValue={null}
            />
          </div>
        </div>

        <ChoiceList
          choices={[
            {
              label: "Eligibility or enrollment data",
              value: "enrollment_data",
            },
            { label: "Survey data", value: "survey_data" },
            { label: "Another data source", value: "other_data" },
          ]}
          className="ds-u-margin-top--5"
          label="Which data source did you use?"
          name="data_source"
        />
        <div className="question-container">
          <TextField
            label="How did your progress last year compare to your previous year's progress towards your goal?"
            multiline
            name="progress_comparison"
            className="ds-u-margin-top--0"
          />
        </div>

        <div className="question-container">
          <TextField
            label="What are you doing to continually make progress towards your goal?"
            multiline
            name="progress_action"
            className="ds-u-margin-top--0"
          />
        </div>

        <div className="question-container">
          <TextField
            label="Anything else you'd like to tell us about this goal?"
            multiline
            name="additional_information"
            className="ds-u-margin-top--0"
          />
        </div>

        <div className="question-container">
          <TextField
            label="Do you have any supporting documentation?"
            hint="Optional"
            name="supporting_documentation"
            className="ds-u-margin-top--0"
            button="YYYYYYY"
          />
          <button className="ds-c-button">Browse</button>
        </div>
      </Fragment>
    );
  }
}

export default Goal;
