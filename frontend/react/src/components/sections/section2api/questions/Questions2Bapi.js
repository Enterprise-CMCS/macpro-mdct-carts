import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "@reach/accordion/styles.css";
import Objective2bApi from "../objectives/Objective2bApi";
import { addNewObjective } from "../../../../actions/initial";
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
    this.addObjective = this.addObjective.bind(this);
  }
  addObjective() {
    const newObjectiveId =
      this.props.subsectionB.parts[0].questions[0].questions.length + 1;
    const tempObjectivesId = this.props.subsectionB.parts[0].questions[0].id.split(
      "-"
    );
    const firstObjective = this.props.subsectionB.parts[0].questions[0]
      .questions[0];
    //Adds a new objective object to the objectives object
    this.props.addNewObjective(
      `${tempObjectivesId[0]}-${tempObjectivesId[1]}-${tempObjectivesId[2]}-${tempObjectivesId[3]}-${tempObjectivesId[4]}`,
      newObjectiveId,
      firstObjective.id
    );
  }

  render() {
    return (
      <div className="section">
        {
          /* Begin parsing through parts */
          this.props.subsectionB.parts.map((part) => (
            <div className="part">
              <h3 className="part-title"></h3>
              {part.text}
              <div>
                <div className="objective">
                  <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                    {part.questions[0].questions.map((objective) => (
                      <AccordionItem key={objective.id}>
                        {/*Actually looping through each objective */}
                        {objective.questions.map((objectiveGoals) =>
                          objectiveGoals.type !== "repeatables" ? (
                            <div className="accordion-header">
                              <h3>
                                <AccordionButton>
                                  <div className="accordion-title">
                                    Objective:{" "}
                                    {objectiveGoals.answer.default_entry
                                      ? objectiveGoals.answer.default_entry
                                      : objectiveGoals.answer.entry}
                                  </div>
                                  <div className="arrow"></div>
                                </AccordionButton>
                                {
                                  //Checks if objective's main question has been answered
                                  objectiveGoals.answer.default_entry ? null : (
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
              <div className="section-footer">
                <h3 className="question-inner-header">
                  Do you have another objective in your State Plan?
                </h3>
                <div className="ds-c-field__hint">Optional</div>
                <button
                  onClick={this.addObjective}
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
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.name,
  programType: state.programType,
  year: state.formYear,
});

const mapDispatchToProps = {
  addNewObjective: addNewObjective,
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions2BApi);
