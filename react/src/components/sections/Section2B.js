import React, { Component } from "react";
import Sidebar from "../Sidebar";
import Objective2b from "./objectives/Objective2b.js";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";

class Section2b extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectiveCount: 1,
      objectiveArray: [],
    };
    this.newObjective = this.newObjective.bind(this);
  }

  componentDidMount() {
    const initialObjective = {
      id: 1,
      component: <Objective2b objectiveCount={1} />,
    };

    this.setState({
      objectiveArray: [initialObjective],
    });
  }

  newObjective() {
    let newObjectiveId = this.state.objectiveCount + 1;
    let newObjective = {
      id: newObjectiveId,
      component: <Objective2b objectiveCount={newObjectiveId} />,
    };

    this.setState({
      objectiveCount: newObjectiveId,
      objectiveArray: this.state.objectiveArray.concat(newObjective),
    });
  }

  render() {
    return (
      <div className="section-2b">
        <div className="sidebar">{/* <Sidebar /> */}</div>
        <Tabs>
          <TabPanel id="section2b" tab="Section 2B: Performance Goals">
            <div className="section-content">
              <p>
                Your performance goals should match those reflected in your CHIP
                State Plan, Section 9. If your goals are different, submit a
                State Plan Amendment (SPA) to reconcile any differences
              </p>
              <ul>
                {this.state.objectiveArray.map((element) => (
                  <li key={element.id}>{element.component}</li>
                ))}
              </ul>

              <div>
                <h3> Add another objective</h3>
                <p className="ds-base color-gray-light">Optional</p>
                <button
                  onClick={this.newObjective}
                  type="button"
                  className="ds-c-button ds-c-button--primary"
                >
                  Add another objective
                </button>
              </div>
            </div>
          </TabPanel>

          <TabPanel id="section2bPrevious" tab="FY2019 answers">
            Redirect
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Section2b;
