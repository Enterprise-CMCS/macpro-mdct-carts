import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField, ChoiceList, DateField } from "@cmsgov/design-system-core";
import DateRange from "../../../../layout/DateRange";

class Goal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal_numerator_digit: 0,
      goal_denominator_digit: 0,
      percentage: 0,
      shouldCalculate: true,
      goal2bDummyBoolean: true,
      goal2bDummyData: "",
      goal2bDummyDigit: 10,
      discontinued: false,
      selectedFiles: [],
    };
    this.addDivisors = this.addDivisors.bind(this);
    this.percentageCalculator = this.percentageCalculator.bind(this);
    this.discontinuedGoal = this.discontinuedGoal.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    this.setState({
      goal_type_value: "continuing",
      goal_source_value: "enrollment_data",
      goal2bDummyData:
        "This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    });
  }

  handleFileUpload = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
  };

  // Validate the input before returning calculated percentage
  percentageCalculator(numerator, denominator) {
    let quotient;
    if (
      numerator !== "" &&
      numerator > 0 &&
      denominator !== "" &&
      denominator > 0 &&
      this.state.shouldCalculate === true
    ) {
      quotient = (numerator * 100) / denominator;
      return quotient;
    }
    // default value
    return "--";
  }

  // Validate the input and set the state
  addDivisors(evt) {
    let num;
    let denom;
    // If the input includes letters, give the box an error message
    if (
      isNaN(parseInt(evt.target.value)) ||
      /^\d+$/.test(evt.target.value) === false
    ) {
      this.setState({
        [`${evt.target.name}Err`]: "This input takes numbers only",
        shouldCalculate: false,
      });
      return;
    } else {
      // Calculate without waiting for the input to be added to state
      if (evt.target.name === "goal_numerator_digit") {
        num = evt.target.value;
        denom = this.state.goal_denominator_digit || 0;
      } else if (evt.target.name === "goal_denominator_digit") {
        num = this.state.goal_numerator_digit || 0;
        denom = evt.target.value;
      }

      this.setState({
        [evt.target.name]: evt.target.value,
        [`${evt.target.name}Err`]: false,
        shouldCalculate: true,
        percentage: this.percentageCalculator(num, denom),
      });
    }
  }

  discontinuedGoal(evt) {
    if (evt.target.value === "discontinued") {
      this.setState({ discontinued: true });
    } else {
      this.setState({ discontinued: false });
    }
  }

  render() {
    let renderPreviousEntry =
      this.props.previousEntry === "true" ? true : false;

    return (
      <Fragment>
        <div className="question-container">
          <TextField
            label="1. Briefly describe your goal"
            hint="For example: Enroll 75% of eligible children in the CHIP program."
            multiline
            rows={this.props.tallTextField}
            name="goal_description"
            value={
              this.props.previousEntry === "true"
                ? this.state.goal2bDummyData
                : null
            }
          />
        </div>

        <div className="question-container">
          <ChoiceList
            choices={[
              {
                label: "New goal",
                value: "new",
                disabled: renderPreviousEntry ? true : false,
              },
              {
                label: "Continuing goal",
                value: "continuing",

                disabled: renderPreviousEntry ? true : false,
                defaultChecked: renderPreviousEntry ? true : false,
              },
              {
                label: "Discontinued goal",
                value: "discontinued",
                disabled: renderPreviousEntry ? true : false,
              },
            ]}
            label="2. What type of goal is it?"
            name={`goal_type${this.props.goalId}`}
            //choiceLists in Tab components need unique names or their defaultChecked values will be overwritten
            type="radio"
            onChange={this.discontinuedGoal}
          />
        </div>
        {/**
         * If the answer to question 2 is "discontinued" all following questions disapear
         */}
        {this.state.discontinued ? (
          ""
        ) : (
          <div className="dependant-on-discontinued">
            <div className="question-container">
              <h3 className="question-outer-header">
                {" "}
                Define the numerator you're measuring
              </h3>

              <TextField
                label="3. Which population are you measuring in the numerator?"
                hint="For example: The number of children enrolled in CHIP in the last federal fiscal year."
                multiline
                rows={this.props.tallTextField}
                name="goal_numerator_definition"
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyData
                    : null
                }
              />

              <TextField
                label="4. Numerator (total number): "
                hint="Total number"
                name="goal_numerator_digit"
                size="medium"
                errorMessage={this.state.goal_numerator_digitErr}
                onChange={this.addDivisors}
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyDigit
                    : null
                }
              />
              <h3 className="question-outer-header">
                {" "}
                Define the denominator you're measuring
              </h3>
              <TextField
                label="5. Which population are you measuring in the denominator? "
                hint="For example: The total number of eligible children in the last federal fiscal year."
                multiline
                rows={this.props.tallTextField}
                name="goal_denominator_definition"
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyData
                    : null
                }
              />

              <TextField
                label="6. Denominator (total number):"
                hint="Total number"
                name="goal_denominator_digit"
                size="medium"
                errorMessage={this.state.goal_denominator_digitErr}
                onChange={this.addDivisors}
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyDigit
                    : null
                }
              />
            </div>

            <div className="question-container ds-u-border--2">
              <div className="ds-1-row percentages-info">
                <div className="ds-l--auto">
                  <h3 className="question-inner-header">Percentage</h3>
                  <div className="ds-c-field__hint">Auto-calculated</div>
                </div>
              </div>
              <div className="ds-1-row percentages">
                <div>
                  <TextField
                    label="Numerator"
                    name="goal_numerator_digit"
                    size="small"
                    className="ds-l--auto"
                    value={
                      this.props.previousEntry === "true"
                        ? this.state.goal2bDummyDigit
                        : this.state.goal_numerator_digit
                    }
                  />
                </div>
                <div>
                  <div className="divide">&divide;</div>
                  <TextField
                    label="Denominator"
                    name="goal_denominator_digit"
                    size="small"
                    className="ds-l--auto"
                    value={
                      this.props.previousEntry === "true"
                        ? this.state.goal2bDummyDigit
                        : this.state.goal_denominator_digit
                    }
                  />
                </div>
                <div>
                  <div className="divide"> &#61; </div>
                  <TextField
                    label="Percentage"
                    name="goal_percentage"
                    size="small"
                    value={
                      this.props.previousEntry === "true"
                        ? this.state.goal2bDummyDigit
                        : `${this.state.percentage}%`
                    }
                  />
                </div>
              </div>
            </div>

            <div className="question-container">
              <div className="question">
                7. What is the date range for your data?
              </div>
              <div className="date-range-wrapper">
                <DateRange />
              </div>
            </div>

            <div className="question-container">
              <ChoiceList
                choices={[
                  {
                    label: "Eligibility or enrollment data",
                    value: "enrollment_data",
                    disabled: renderPreviousEntry ? true : false,
                    defaultChecked: renderPreviousEntry ? true : false,
                  },
                  {
                    label: "Survey data",
                    value: "survey_data",
                    disabled: renderPreviousEntry ? true : false,
                  },
                  {
                    label: "Another data source",
                    value: "other_data",
                    disabled: renderPreviousEntry ? true : false,
                  },
                ]}
                className="ds-u-margin-top--5"
                label="8. Which data source did you use?"
                name={`data_source${this.props.goalId}`}
                //choiceLists in Tab components need unique names or their defaultChecked values will be overwritten
              />
            </div>

            <div className="question-container">
              <TextField
                label="9. How did your progress towards your goal last year compare to your previous year’s progress?"
                multiline
                rows={this.props.tallTextField}
                name="progress_comparison"
                className="ds-u-margin-top--0"
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyData
                    : null
                }
              />
            </div>

            <div className="question-container">
              <TextField
                label="10. What are you doing to continually make progress towards your goal?"
                multiline
                rows={this.props.tallTextField}
                name="progress_action"
                className="ds-u-margin-top--0"
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyData
                    : null
                }
              />
            </div>

            <div className="question-container">
              <TextField
                label="11. Anything else you’d like to add about this goal?"
                multiline
                name="additional_information"
                className="ds-u-margin-top--0"
                value={
                  this.props.previousEntry === "true"
                    ? this.state.goal2bDummyData
                    : null
                }
              />
            </div>

            <div className="question-container">
              {renderPreviousEntry ? (
                <Fragment>
                  <TextField
                    label="12. Do you have any supporting documentation?"
                    hint="Optional"
                    name="supporting_documentation"
                    className="ds-u-margin-top--0"
                    disabled={true}
                    value={"SomeFile2019.docx"}
                  />
                  <button disabled className="ds-c-button">
                    Browse
                  </button>
                </Fragment>
              ) : (
                <TextField
                  label="12. Do you have any supporting documentation?"
                  requirementLabel="Optional"
                  className="ds-u-margin-top--0"
                  onChange={this.handleFileUpload}
                  name="fileUpload"
                  type="file"
                  multiple
                />
              )}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.formYear,
  tallTextField: state.largeTextBoxHeight,
});

export default connect(mapStateToProps)(Goal);
