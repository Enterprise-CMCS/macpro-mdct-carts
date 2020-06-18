import React, { Component, Fragment } from "react";
import Goal from "./goals/Goal2b";
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

class Objective2b extends Component {
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
    const initialGoal = {
      id: 1,
      component: <Goal goalCount={1} />,
    };

    let dummyDataArray = [];
    for (let i = 1; i < 4; i++) {
      dummyDataArray.push({
        id: i,
        component: <Goal goalCount={i} previousEntry="true" />,
      });
    }
    this.setState({
      goalArray: [initialGoal],
      previousGoalsArray: dummyDataArray,
      objective2bDummyData:
        "This is what you wrote last year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis varius odio, vel maximus enim.",
    });
  }

  newGoal() {
    let newGoalId = this.state.goalCount + 1;
    let newGoal = {
      id: newGoalId,
      component: <Goal goalCount={newGoalId} />,
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
          <TextField
            hint="For example: Our objective is to increase enrollment in our CHIP program."
            label="What is your first objective as listed in your CHIP State Plan?"
            multiline
            name={"objective_" + this.props.objectiveCount + "_text"}
            value={
              this.props.previousEntry === "true"
                ? this.state.objective2bDummyData
                : null
            }
          />
          <div className="goals">
            {this.props.previousEntry === "true" ? (
              <Accordion>
                {this.state.previousGoalsArray.map((element) => (
                  <AccordionItem key={element.id}>
                    <h3>
                      <AccordionButton>Goal {element.id}:</AccordionButton>
                    </h3>
                    <AccordionPanel>{element.component}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Accordion>
                {this.state.goalArray.map((element) => (
                  <AccordionItem key={element.id}>
                    <h3>
                      <AccordionButton>Goal {element.id}:</AccordionButton>
                    </h3>
                    <AccordionPanel>{element.component}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        <div className="objective-footer">
          <h3> Do you have another goal for this objective?</h3>
          <p className="ds-base color-gray-light">Optional</p>
          <button
            onClick={this.newGoal}
            type="button"
            className="ds-c-button ds-c-button--primary"
          >
            Add another goal
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </Fragment>
    );
  }
}

export default Objective2b;
