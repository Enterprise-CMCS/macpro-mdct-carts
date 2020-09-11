import { selectQuestion } from "../../../store/selectors";
import { setAnswer } from "../../../actions/initial";
import React, { Component } from "react";
import { connect } from "react-redux";

class ObjectiveAndGoals extends Component {
  constructor(props) {
    super(props);
    this.addNewObjective = this.addNewObjective.bind(this);
    this.addNewGoal = this.addNewGoal.bind(this);
  }

  addNewObjective = (newObjectiveId, year, state) => {
    let objectiveIdString = "";
    if (newObjectiveId < 9) {
      objectiveIdString = "0" + newObjectiveId;
    }
    const newGoalId = 1; //It was throwing an error when I just put 1 for newGoalId
    let newObjective = selectQuestion(
      `${year}-01-b-01-01-01`,
      this.props.state
    );
    newObjective.id = `${year}-01-b-01-01-${objectiveIdString}`;
    newObjective.questions[0].answer.entry = null;
    newObjective.questions[0].answer.readonly = false;
    newObjective.questions[0].id = `${year}-02-b-01-01-${objectiveIdString}-01`;
    newObjective.questions[1].id = `${year}-02-b-01-01-${objectiveIdString}-02`;
    newObjective.questions[1].questions = [
      this.addNewGoal(newGoalId, objectiveIdString, year),
    ];
    return { newObjective };
  };

  addNewGoal = (newGoalId, objectiveId, year) => {
    let goalIdString = "";
    if (newGoalId < 9) {
      goalIdString = "0" + newGoalId;
    }
    let newGoal = selectQuestion(
      `${year}-02-b-01-01-01-02-01`,
      this.props.state
    );
    newGoal.id = `${year}-02-b-01-01-${objectiveId}-02-${goalIdString}`;
    let count = 1;
    let subCount = 0;
    let subQuestionLetter = ["a", "b", "c", "d", "e"];
    let tempGoalId = "";
    newGoal.questions.forEach((goal) => {
      if (count < 9) {
        tempGoalId = "0" + count;
      }

      if (goal.type === "fieldset") {
        subCount = 0;
        if (goal.fieldset_info.targets) {
          let tempTarget = goal.fieldset_info.targets[0].split("-");
          goal.fieldset_info.targets[0] =
            tempTarget[0] +
            "-" +
            tempTarget[1] +
            "-" +
            tempTarget[2] +
            "-" +
            tempTarget[3] +
            "-" +
            tempTarget[4] +
            "-" +
            objectiveId +
            "-" +
            tempTarget[6] +
            "-" +
            goalIdString +
            "-" +
            tempTarget[8];
          tempTarget = goal.fieldset_info.targets[1].split("-");
          goal.fieldset_info.targets[1] =
            tempTarget[0] +
            "-" +
            tempTarget[1] +
            "-" +
            tempTarget[2] +
            "-" +
            tempTarget[3] +
            "-" +
            tempTarget[4] +
            "-" +
            objectiveId +
            "-" +
            tempTarget[6] +
            "-" +
            goalIdString +
            "-" +
            tempTarget[8];
        }
        goal.questions.forEach((subquestion) => {
          let tempSubquestion = subquestion.id.split("-");
          subquestion.id = `${year}-02-b-01-01-${objectiveId}-02-${goalIdString}-${tempSubquestion[8]}`;
          subquestion.answer.entry = null;
          if (subquestion.context_data.hide_if.target) {
            let tempTarget = subquestion.context_data.hide_if.target
              .split("-")[8]
              .subString(0, 2);
            subquestion.context_data.hide_if.target =
              tempTarget[0] +
              "-" +
              tempTarget[1] +
              "-" +
              tempTarget[2] +
              "-" +
              tempTarget[3] +
              "-" +
              tempTarget[4] +
              "-" +
              objectiveId +
              "-" +
              tempTarget[6] +
              "-" +
              goalIdString +
              "-" +
              tempTarget[8];
          }
          subCount = subCount + 1;
        });
      } else {
        goal.id = `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-${tempGoalId}`;
        goal.answer.entry = null;
        if (goal.questions) {
          subCount = 0;
          goal.questions.forEach((subquestion) => {
            subquestion.id = `${year}-02-b-01-01-${objectiveId}-02-${goalIdString}-${tempGoalId}-${subQuestionLetter[subCount]}`;
            subquestion.answer.entry = null;
            if (subquestion.context_data.conditional_display.hide_if.target) {
              let tempTarget = subquestion.context_data.conditional_display.hide_if.target.split(
                "-"
              );
              subquestion.context_data.hide_if.target =
                tempTarget[0] +
                "-" +
                tempTarget[1] +
                "-" +
                tempTarget[2] +
                "-" +
                tempTarget[3] +
                "-" +
                tempTarget[4] +
                "-" +
                objectiveId +
                "-" +
                tempTarget[6] +
                "-" +
                goalIdString +
                "-" +
                tempTarget[8];
            }

            subCount = subCount + 1;
          });
        }
      }
    });
    //Returns all 12 questions for a new goal
    return { newGoal };
  };
}
const mapStateToProps = (state) => ({
  state: state,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveAndGoals);
