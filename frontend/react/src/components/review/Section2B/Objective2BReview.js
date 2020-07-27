import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Goals2BReview from "./Goals2BReview";
import { TextField } from "@cmsgov/design-system-core";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import { sliceId } from "../../Utils/helperFunctions";

class Objective2BReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalCount: 1,
      goalArray: [],
      objective2bDummyData: "",
      objectiveDescription: "",
      previousGoalsArray: [],
    };
    this.newGoal = this.newGoal.bind(this);
  }

  componentDidMount() {
    const initialGoal = [
      {
        id: `${this.props.year}_1`,
        // Each goal has a goalID with the format '<year>_<the objective it belongs to>_ <the goal's own ID>'
        // The sliceId() helper function extracts just the year from the parent objective
        component: (
          <Goals2BReview
            goalId={`${this.props.year}_${sliceId(this.props.objectiveId)}_1`}
          />
        ),
      },
    ];

    let dummyDataArray = [];
    for (let i = 1; i < 3; i++) {
      dummyDataArray.push({
        id: `${this.props.year - 1}_${i}`,
        // Each goal has a goalID with the format '<year>_<the objective it belongs to>_ <the goal's own ID>'
        // The sliceId() helper function extracts just the year from the parent objective
        component: (
          <Goals2BReview
            goalId={`${this.props.year - 1}_${sliceId(
              this.props.objectiveId
            )}_${i}`}
            previousEntry="true"
          />
        ),
      });
    }

    this.setState({
      goalArray: initialGoal,
      previousGoalsArray: dummyDataArray,
      objective2bDummyData:
        "This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim.",
    });
  }

  newGoal() {
    let newGoalId = this.state.goalCount + 1;
    let newGoal = {
      id: `${this.props.year}_${newGoalId}`,
      // Each goal has an ID with the format <year>_<the objective it belongs to>_ <the goal's own ID>
      // The sliceId() helper function extracts just the year from the parent objective
      component: (
        <Goals2BReview
          goalId={`${this.props.year}_${sliceId(
            this.props.objectiveId
          )}_${newGoalId}`}
        />
      ),
    };

    this.setState({
      goalCount: newGoalId,
      goalArray: this.state.goalArray.concat(newGoal),
    });
  }

  render() {
    return (
      <Fragment>
        <div className="objective-body">
          <h4>
            What is your first objective as listed in your CHIP State Plan?
          </h4>
          <div className="textfield">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            viverra, mi dapibus blandit ultricies, tortor metus venenatis nulla,
            ac lacinia tortor massa sit amet nisl. Sed lacinia purus vel lectus
            facilisis, a suscipit ex aliquam. Donec blandit sem fringilla orci
            blandit vehicula. Sed et ante vulputate, porttitor nisi non, commodo
            risus.
          </div>
          <div className="goals">
            {/**
             * Maps through array of Previous Goals in state
             * If the props include previousEntry==="true", render previous year's data
             */}
            {this.props.previousEntry === "true" ? (
              <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                {this.state.previousGoalsArray.map((element) => (
                  <AccordionItem key={element.id}>
                    <h3>
                      <AccordionButton>
                        {/**
                         * Returns ID from longer string
                         */}
                        Goal {sliceId(element.id)}:
                      </AccordionButton>
                    </h3>
                    <AccordionPanel>{element.component}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              //  Alternatively,  This maps through the current goals in state

              <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                {this.state.goalArray.map((element) => (
                  <AccordionItem key={element.id}>
                    <h3>
                      <AccordionButton>
                        {/**
                         * Returns ID from longer string
                         */}
                        Goal {sliceId(element.id)}:
                      </AccordionButton>
                    </h3>

                    <AccordionPanel>{element.component}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        <div className="objective-footer">
          <h3 className="question-inner-header">
            Do you have another goal in your State Plan for this objective?{" "}
          </h3>
          <div className="ds-c-field__hint">Optional</div>
          <button
            onClick={this.newGoal}
            type="button"
            className="add-goal ds-c-button ds-c-button--primary"
          >
            Add another goal
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Objective2BReview);
