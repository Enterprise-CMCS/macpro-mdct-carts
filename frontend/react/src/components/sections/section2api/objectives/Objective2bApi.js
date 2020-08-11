import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Goal2bApi from "./goals/Goal2bApi";
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
import { sliceId } from "../../../Utils/helperFunctions";
import FPL from "../../../layout/FPL";
import CMSChoice from "../../../fields/CMSChoice";

class Objective2bApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalCount: this.props.goalCount,
      goalArray: this.props.goalArray,
      objective2bDummyData: "",
      objectiveDescription: "",
      previousGoalsArray: [],
      previousEntry: this.props.previousEntry
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
          <Goal2bApi
            goalId={`${this.props.year}_${this.props.objectiveId}_1`}
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
          <Goal2bApi
            goalId={`${this.props.year - 1}_${
              this.props.objectiveId
              }_${i}`}
            previousEntry="true"
          />
        ),
      });
    }

    this.setState({
      //goalArray: initialGoal,
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
        <Goal2bApi
          goalId={`${this.props.year}_${
            this.props.objectiveId
            }_${newGoalId}`}
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
          {console.log("objective Goals")}
          {
            console.log(this.props.goalArray)}
          <div className="goals">
            {/**
             * Maps through array of Previous Goals in state
             * If the props include previousEntry==="true", render previous year's data
             */}
            {this.props.previousEntry === "true" ? (
              <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                {this.state.previousGoalsArray.map((element) => {
                  var tempString = element.id;
                  return (
                    <AccordionItem key={tempString} >
                      <h3>
                        <AccordionButton>
                          {tempString ? (
                            <div>Goal {tempString.substring(5)}:</div>)
                            : null}
                        </AccordionButton>
                      </h3>
                      <AccordionPanel>{element.component}</AccordionPanel>
                    </AccordionItem>
                  )
                }
                )}
              </Accordion>
            ) : (
                //  Alternatively,  This maps through the current goals in state

                <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                  {this.props.goalArray.map((element) => (
                    <AccordionItem key={element.id} >
                      <AccordionButton>
                        <div>Goal {element.id}:</div>{/* {tempString.substring(5)}*/}
                      </AccordionButton>
                      <h3>
                        {console.log("inside element")}
                        {console.log(element.id)}
                        <div>


                        </div>

                      </h3>

                      <AccordionPanel>{<CMSChoice
                        name={element.id}
                        label={element.label}
                        type={element.type}
                        answer={element.answer}
                      />}</AccordionPanel>
                    </AccordionItem>

                  )
                  )}
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
      </Fragment >
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Objective2bApi);
