import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import Objective2bApi from "../objectives/Objective2bApi";
import { addNewObjective } from "../ObjectiveAndGoals";
import { addElementToFragment } from "../../../../actions/initial";
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
      objectivesArray: this.props.objectivesArray,
    };
    this.newObjective = this.newObjective.bind(this);
  }
  newObjective() {
    let newObjectiveId = this.props.objectiveCount + 1;
    //Adds a new objective object to the objectives object
    this.props.addElement(`2020-02-b-01-01`, addNewObjective(newObjectiveId));
  }

  render() {
    const stateProgram = "medicaid_exp_chip";
    return (
      <>
        <div className="section">
          {
            /* Begin parsing through parts */
            this.props.subsectionB.parts.map((part) => (
              <div className="part">
                {part.id ===
                "2020-02-b" /*Is this handled by conditional logic?*/ ? (
                  part.programType === "medicaid_exp_chip" ||
                  part.programType === "separate_chip" ||
                  part.programType === "combo" ? (
                    console.log("allow display?")
                  ) : null
                ) : (
                  <div>
                    <h3 className="part-title"></h3>
                    {part.text}
                    <div>
                      <div className="objective">
                        <Accordion
                          multiple
                          defaultIndex={[...Array(100).keys()]}
                        >
                          {this.props.objectivesArray.map((objective) => (
                            <AccordionItem key={objective.id}>
                              {/*Actually looping through each objective */}
                              {objective.questions.map(
                                (objectiveGoals, index) =>
                                  index === 0 ? (
                                    <div className="accordion-header">
                                      <h3>
                                        <AccordionButton>
                                          <div className="accordion-title">
                                            Objective:{" "}
                                            {objectiveGoals.answer.default_entry
                                              ? objectiveGoals.answer
                                                  .default_entry
                                              : null}
                                          </div>
                                          <div className="arrow"></div>
                                        </AccordionButton>
                                        {
                                          //Checks if objective's main question has been answered
                                          objectiveGoals.answer
                                            .default_entry ? null : (
                                            <QuestionComponent
                                              data={[objectiveGoals]}
                                            />
                                          )
                                        }
                                      </h3>
                                    </div>
                                  ) : (
                                    <h3>
                                      <AccordionPanel>
                                        <Objective2bApi
                                          //gives object that contains array of goals
                                          goalsArray={objectiveGoals.questions}
                                          goalCount={
                                            objectiveGoals.questions.length
                                          }
                                          objectiveId={objectiveGoals.id}
                                        />
                                      </AccordionPanel>
                                    </h3>
                                  )
                              )}
                            </AccordionItem>
                          ))}
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

const mapDispatchToProps = {
  addElement: addElementToFragment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions2BApi);
