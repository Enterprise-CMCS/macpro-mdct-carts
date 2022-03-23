import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { TextField, Choice, ChoiceList } from "@cmsgov/design-system-core";
import DateRange from "../../layout/DateRange";

class Goals2BReview extends Component {
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
      p1_q1_answer: null,
      p1_q2_answer: "new",
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
        <div className={"question-container textfield"}>
          <legend className="ds-c-label">1. Briefly describe your goal</legend>
          <div className="textfield">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec
            consequat orci. Aliquam posuere ligula urna, gravida suscipit neque
            sodales quis. Morbi ultrices sapien placerat fringilla bibendum.
            Vestibulum maximus augue lorem, quis molestie massa varius vitae.
            Aenean sit amet massa eu augue luctus ornare.
          </div>
        </div>

        <div className="question-container radio">
          <legend className="ds-c-label">2. What type of goal is it?</legend>
          <Choice
            name={`goal_type${this.props.goalId}`}
            value="new"
            defaultChecked={this.state.p1_q2_answer === "new" ? true : false}
            disabled={renderPreviousEntry ? true : false}
            type="radio"
            onChange={this.discontinuedGoal}
          >
            New goal
          </Choice>
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
                Define the numerator you're measuring
              </h3>
              <legend className="ds-c-label">
                3. Which population are you measuring in the numerator?
              </legend>

              <div className="textfield">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                nec consequat orci. Aliquam posuere ligula urna, gravida
                suscipit neque sodales quis. Morbi ultrices sapien placerat
                fringilla bibendum. Vestibulum maximus augue lorem, quis
                molestie massa varius vitae. Aenean sit amet massa eu augue
                luctus ornare.
              </div>
              <legend className="ds-c-label">
                4. Numerator (total number):
              </legend>
              <div className="textfield">10</div>
              <h3 className="question-outer-header">
                Define the denominator you're measuring
              </h3>
              <legend className="ds-c-label">
                5. Which population are you measuring in the denominator?
              </legend>
              <div className="textfield">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                nec consequat orci.
              </div>
              <legend className="ds-c-label">
                6. Denominator (total number):
              </legend>
              <div className="textfield">10</div>
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
                <DateRange
                  previousEntry={
                    this.props.previousEntry === "true" ? true : false
                  }
                />
              </div>
            </div>

            <div className="question-container">
              <ChoiceList
                choices={[
                  {
                    label: "Eligibility or enrollment data",
                    value: "enrollment_data",
                    disabled: renderPreviousEntry ? true : false,
                    defaultChecked: true,
                  },
                ]}
                className="ds-u-margin-top--5"
                label="8. Which data source did you use?"
                name={`data_source${this.props.goalId}`}
                type="radio"
                //choiceLists in Tab components need unique names or their defaultChecked values will be overwritten
              />
            </div>

            <div className="question-container">
              <legend className="ds-c-label">
                9. How did your progress towards your goal last year compare to
                your previous year’s progress?
              </legend>

              <div className="textfield">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                nec consequat orci. Aliquam posuere ligula urna, gravida
                suscipit neque sodales quis. Morbi ultrices sapien placerat
                fringilla bibendum. Vestibulum maximus augue lorem, quis
                molestie massa varius vitae. Aenean sit amet massa eu augue
                luctus ornare.
              </div>
            </div>

            <div className="question-container">
              <legend className="ds-c-label">
                10. What are you doing to continually make progress towards your
                goal?
              </legend>

              <div className="textfield">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                nec consequat orci. Aliquam posuere ligula urna, gravida
                suscipit neque sodales quis. Morbi ultrices sapien placerat
                fringilla bibendum.
              </div>
            </div>

            <div className="question-container">
              <legend className="ds-c-label">
                11. Anything else you’d like to add about this goal?
              </legend>

              <div className="textfield unanswered-text"></div>
            </div>

            <div className="question-container">
              <legend className="ds-c-label">
                12. Do you have any supporting documentation?
              </legend>

              <div className="textfield">myFile2019.docx</div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.global.formYear,
  tallTextField: state.global.largeTextBoxHeight,
});

export default connect(mapStateToProps)(Goals2BReview);
