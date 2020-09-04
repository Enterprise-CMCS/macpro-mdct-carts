import React, { Component } from "react";
import { connect } from "react-redux";
import FPL from "../../../layout/FPL";
import { Choice, ChoiceList, TextField } from "@cmsgov/design-system-core";
import CMSChoice from "../../../fields/CMSChoice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import Objective2bApi from "../objectives/Objective2bApi";
import { addNewObjective } from "../ObjectiveAndGoals";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import QuestionComponent from "../../../fields/QuestionComponent";

class Questions2BApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subsectionB: this.props.subsectionB,
      objectivesArray: this.props.subsectionB.parts[0].questions[0].questions,
      objectiveCount: this.props.subsectionB.parts[0].questions[0].questions
        .length,
    };
    this.previousEntry = this.props.previousEntry;
    this.handleChange = this.handleChange.bind(this);
    this.newObjective = this.newObjective.bind(this);
  }
  // Get state program (temporary; will be set by API)
  newObjective() {
    let newObjectiveId = this.state.objectiveCount + 1;
    this.setState({
      objectiveCount: newObjectiveId,
      objectiveArray: this.state.objectivesArray.push(
        addNewObjective(newObjectiveId)
      ),
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
    return (
      <>
        <div className="section">
          {
            /* Begin parsing through parts */
            this.state.subsectionB.parts.map((part) => (
              <div className="part">
                {part.id === "2020-02-b" /*this isn't right*/ ? (
                  part.programType === "medicaid_exp_chip" ||
                  part.programType === "separate_chip" ||
                  part.programType === "combo" ? (
                    console.log("allow display?")
                  ) : null
                ) : (
                  <div>
                    <h3 className="part-title">{/*not used?*/}</h3>
                    {/* NOT USED? Determine if question should be shown */}
                    {part.text}
                    {/*Looping through objectives objects?*/}

                    <div>
                      {/*Actually looping through objectives */}
                      {/*      objectives    objective   */}
                      <div className="objective">
                        <Accordion
                          multiple
                          defaultIndex={[...Array(100).keys()]}
                        >
                          {part.questions.map((objectives) =>
                            objectives.questions.map((objective) => (
                              <AccordionItem key={objective.id}>
                                {objective.questions.map(
                                  (objectiveGoals, index) =>
                                    index === 0 ? (
                                      <div className="accordion-header">
                                        <h3>
                                          <AccordionButton>
                                            <div className="accordion-title">
                                              Objective:{" "}
                                              {objectiveGoals.answer
                                                .default_entry
                                                ? objectiveGoals.answer
                                                    .default_entry
                                                : null}
                                            </div>
                                            <div className="arrow"></div>
                                          </AccordionButton>
                                          {objectiveGoals.answer
                                            .default_entry ? null : (
                                            <QuestionComponent
                                              data={[objectiveGoals]}
                                            />
                                          )}
                                        </h3>
                                      </div>
                                    ) : (
                                      <h3>
                                        <AccordionPanel>
                                          {console.log(
                                            "preObjective2b",
                                            objectiveGoals.questions
                                          )}
                                          <Objective2bApi
                                            goalsArray={
                                              objectiveGoals.questions
                                            } //gives object that contains array of goals
                                          />
                                        </AccordionPanel>
                                      </h3>
                                    )
                                )}
                              </AccordionItem>
                            ))
                          )}
                        </Accordion>
                      </div>
                    </div>
                  </div>
                )}
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
              </div>
            ))
          }
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

export default connect(mapStateToProps)(Questions2BApi);
