import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Objective2b from "./objectives/Objective2b.js";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";
import { connect } from "react-redux";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";

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
        <div className="ds-l-container">
          <div className="ds-l-row">
            <div className="sidebar ds-l-col--3">
              <Sidebar />
            </div>

            <div className="main ds-l-col--9">
              <div className="page-info">
                <div className="edit-info">Draft | Last Edit: 4/3/20</div>
                <h1>{this.props.name} CARTS FY2020</h1>
              </div>
              <Tabs>
                <TabPanel id="section2b" tab="Section 2B: Performance Goals">
                  <div className="section-content">
                    <p>
                      Your performance goals should match those reflected in
                      your CHIP State Plan, Section 9. If your goals are
                      different, submit a State Plan Amendment (SPA) to
                      reconcile any differences
                    </p>
                    <div className="objective-accordiion">
                      <Accordion>
                        {this.state.objectiveArray.map((element) => (
                          <AccordionItem key={element.id}>
                            <div className="accordion-header">
                              <h3>
                                <AccordionButton>
                                  <div className="title">
                                    Objective {element.id}:
                                  </div>
                                  <div className="arrow"></div>
                                </AccordionButton>
                              </h3>
                            </div>
                            <AccordionPanel>{element.component}</AccordionPanel>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    <div>
                      <h3> Add another objective</h3>
                      <p className="ds-base color-gray-light">Optional</p>
                      <button
                        onClick={this.newObjective}
                        type="button"
                        className="ds-c-button ds-c-button--primary"
                      >
                        Add another objective
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel id="section2bPrevious" tab="FY2019 answers">
                  Redirect
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
});

export default connect(mapStateToProps)(Section2b);
