import React, { Component, Fragment } from "react";
import Goal from "./goals/Goal2b";
import { TextField } from "@cmsgov/design-system-core";

class Objective2b extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalCount: 1,
      goalArray: [],
    };
    this.newGoal = this.newGoal.bind(this);
  }

  componentDidMount() {
    const initialGoal = {
      id: 1,
      component: <Goal goalCount={1} />,
    };

    this.setState({
      goalArray: [initialGoal],
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
        <div>
          <h2> Objective {this.props.objectiveCount}: </h2>
          <TextField
            hint="For example: Our objective is to increase enrollment in our CHIP program."
            label="What is your first objective as listed in your CHIP State Plan?"
            multiline
            name={"objective_" + this.props.objectiveCount + "_text"}
          />
          <ul>
            {this.state.goalArray.map((element) => (
              <li key={element.id}>{element.component}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3> Do you have another goal for this objective?</h3>
          <p className="ds-base color-gray-light">Optional</p>
          <button
            onClick={this.newGoal}
            type="button"
            className="ds-c-button ds-c-button--primary"
          >
            Add another goal
          </button>
        </div>
      </Fragment>
    );
  }
}

export default Objective2b;
