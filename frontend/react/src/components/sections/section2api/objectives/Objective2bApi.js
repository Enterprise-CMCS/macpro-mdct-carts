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
import CMSLegend from "../../../fields/CMSLegend";
import Questions2Bapi from "../questions/Questions2Bapi";
import { addNewGoal } from "../ObjectiveAndGoals"
import QuestionComponent from "../../../fields/QuestionComponent";

class Objective2bApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousEntry: this.props.previousEntry,
      goalsArray: this.props.goalsArray,
      goalCount: this.props.goalsArray.length
    };
    this.newGoal = this.newGoal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt[0]]: evt[1],
    });
  }



  newGoal() {
    let newGoalId = this.state.goalCount + 1;
    this.props.goalsArray.push(addNewGoal(newGoalId));
    this.setState({
      goalCount: newGoalId,
      goalsArray: this.state.goalsArray,
    });
  }

  render() {
    return (
      <Fragment>

        <div className="objective-body">
          <div className="goals">
            {
            /**
             * Maps through array of Previous Goals in state
             * If the props include previousEntry==="true", render previous year's data
             */}
            {this.props.previousEntry === "true" ? (
              <Accordion multiple defaultIndex={[...Array(100).keys()]}>
                {this.state.previousGoalsArray.map((goals) => (
                  <AccordionItem key={goals.id}>
                    <div className="accordion-header">
                      <h3>
                        <AccordionButton>
                          <div className="accordion-title">
                            Goal {goals.id.substring(goals.id.length - 2)}:
                            </div>
                        </AccordionButton>
                      </h3>
                    </div>
                    {
                      goals.questions.map((question) => (
                        <>
                          {question.type !== "fieldset" ? (
                            <AccordionPanel>
                              <div className="singleGoal">
                                <div className="question">
                                  <fieldset className="ds-c-fieldset">
                                    {parseInt(goals.id.substring(goals.id.length - 2))}.
                                    {question.type === "radio" || question.type === "checkbox"
                                      ? question.answer.options.map((
                                        { label, value },
                                        index
                                      ) => {
                                        return (
                                          <CMSChoice
                                            name={question.id}
                                            value={value}
                                            label={label}
                                            type={question.type}
                                            onChange={this.handleChange}
                                            answer={question.answer.entry}
                                            conditional={question.conditional}
                                            children={question.questions}
                                            valueFromParent={this.state[question.id]}
                                          />
                                        );
                                      })
                                      : null}
                                    {/* If textarea */}
                                    {question.type === "text_long" || question.type === "text_multiline" ? (
                                      <div>
                                        <textarea
                                          class="ds-c-field"
                                          name={question.id}
                                          value={question.answer.entry}
                                          type="text"
                                          name={question.id}
                                          rows="6"
                                        />
                                      </div>
                                    ) : null}
                                    {/* If FPL Range */}
                                    {question.type === "ranges" ? (
                                      <div>
                                        <FPL label={question.label} />
                                      </div>
                                    ) : null}
                                  </fieldset>
                                </div>
                              </div>
                            </AccordionPanel>) : null}
                        </>
                      ))
                    }
                  </AccordionItem>

                )
                )}
              </Accordion>
            ) : (
                //  Alternatively,  This maps through the current goals in state
                <>
                  <Accordion multiple defaultIndex={0}>
                    {this.state.goalsArray.map((goals) => (
                      <AccordionItem key={goals.id} >
                        <div className="accordion-header">
                          <h3>
                            <AccordionButton>
                              <div className="accordion-title">
                                Goal {parseInt(goals.id.substring(goals.id.length - 2))}:
                            </div>
                            </AccordionButton>
                          </h3>
                        </div>
                        <AccordionPanel>
                          <QuestionComponent data={goals.questions}
                            sectionContext={this.props.sectionContext} />
                        </AccordionPanel>
                      </AccordionItem>

                    )
                    )}
                  </Accordion>
                </>
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
