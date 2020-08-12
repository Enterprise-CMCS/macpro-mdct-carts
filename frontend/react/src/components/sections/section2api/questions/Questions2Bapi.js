import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import Data from "../backend-json-section-2.json";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import CMSChoice from "../../../fields/CMSChoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import Objective2bApi from "../objectives/Objective2bApi"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";

class Questions2BApi extends Component {
  constructor(props) {
    super(props);
    this.objectiveCount = 1;
    this.state = { temp: "Here is the original stuff" };
    this.previousEntry = this.props.previousEntry;
    this.handleChange = this.handleChange.bind(this);
    this.newObjective = this.newObjective.bind(this);
    this.objectiveArray = this.props.objectiveArray;
  }
  // Get state program (temporary; will be set by API)
  newObjective() {
    console.log("adding new objective")
    let newObjectiveId = this.state.objectiveCount + 1;
    let newObjective = {
      id: `${this.props.year}_${newObjectiveId}`,
      // This builds a new component with an ID taken from the current year and the next available ID
      component: (
        <Objective2bApi objectiveId={`${this.props.year}_${newObjectiveId}`} />
      ),
    };
    this.setState({
      objectiveCount: newObjectiveId,
      objectiveArray: this.state.objectiveArray.concat(newObjective),
    });
  }

  handleChange(evt) {
    console.log("Handle Change occured", evt);
    this.setState({
      temp: "This has been changed",
      [evt[0]]: evt[1],
    });
  }

  render() {
    const stateProgram = "medicaid_exp_chip";
    let createChoices;
    const tempData = Data.section.subsections[1];
    return (
      <form>
        {/* Begin parsing through subsection */}
        <div className="section" >
          {/* Begin parsing through parts */}
          {
            tempData.parts.map((part) => (
              <div className="part">
                {part.id === "2020-02-b-02" ? /*this isn't right*/
                  ((this.props.programType === "medicaid_exp_chip" ||
                    this.props.programType === "separate_chip" ||
                    this.props.programType === "combo") ? console.log("allow display?") : null)
                  : (
                    <div>

                      <h3 className="part-title">{/*not used?*/}</h3>
                      {/* NOT USED? Determine if question should be shown */}
                      {part.text}
                      {/*Looping through objectives objects?*/}

                      <div>
                        {/*Actually looping through objectives */}
                        {/*      objectives    objective   */}
                        <div className="objective">

                          <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                            {part.questions.map((objectives) => (
                              objectives.questions.map((objective) => (
                                <AccordionItem key={objective.id}>
                                  {objective.questions.map((objectiveGoals, index) => (
                                    index === 0 ? (

                                      <div className="accordion-header">
                                        <h3>

                                          <AccordionButton>
                                            <div className="accordion-title">
                                              Objective: {objectiveGoals.answer.default_entry}
                                            </div>
                                            <div className="arrow"></div>
                                          </AccordionButton>
                                        </h3>
                                      </div>) :
                                      (<h3>
                                        <AccordionPanel>{/*Data.section.subsections[1].parts[0].questions[0].questions[0].questions[1].questions[0].questions*/}
                                          <Objective2bApi
                                            goalsArray={objectiveGoals.questions}//gives object that contains array of goals
                                            goalCount={12}
                                            previousEntry={this.props.previousEntry}
                                          ></Objective2bApi>


                                          <div className="question">
                                            {objective.id === "2020-02-b-01-01-01" ? "" : null}
                                          </div>
                                        </AccordionPanel>
                                      </h3>)
                                  )
                                  )}
                                </AccordionItem>
                              )
                              )
                            ))
                            }
                          </Accordion>
                        </div>

                      </div>
                    </div>
                  )
                }
                <div className="section-footer">
                  <h3 className="question-inner-header">
                    Do you have another objective in your State Plan?
                      </h3>
                  <div className="ds-c-field__hint">Optional</div>
                  <button
                    onClick={this.newObjective}
                    type="button"
                    className="add-objective ds-c-button ds-c-button--primary"
                  >
                    Add another objective
                        <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div >
            ))
          }
        </div>
      </form >
    )
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions2BApi);
