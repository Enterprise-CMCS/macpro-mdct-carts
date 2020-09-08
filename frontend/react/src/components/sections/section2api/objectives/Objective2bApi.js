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
import { addNewGoal } from "../ObjectiveAndGoals";
import QuestionComponent from "../../../fields/QuestionComponent";

class Objective2bApi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalsArray: this.props.goalsArray,
      goalCount: this.props.goalsArray.length,
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
      goalsArray: this.props.goalsArray,
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
               */

              //  Alternatively,  This maps through the current goals in state
              <>
                <Accordion multiple defaultIndex={0}>
                  {this.props.goalsArray.map((goals) => (
                    <AccordionItem key={goals.id}>
                      <div className="accordion-header">
                        <h3>
                          <AccordionButton>
                            <div className="accordion-title">
                              Goal{" "}
                              {parseInt(
                                goals.id.substring(goals.id.length - 2)
                              )}
                              :
                            </div>
                          </AccordionButton>
                        </h3>
                      </div>
                      <AccordionPanel>
                        <QuestionComponent data={goals.questions} />
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            }
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
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  year: state.global.formYear,
});

export default connect(mapStateToProps)(Objective2bApi);
