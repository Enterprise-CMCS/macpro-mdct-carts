import { selectQuestion } from "../../../store/selectors";
import { setAnswer } from "../../../actions/initial";
import React, { Component } from "react";
import { connect } from "react-redux";

const addNewObjective = (newObjectiveId, year, state) => {
  let objectiveIdString = "";
  if (newObjectiveId < 9) {
    objectiveIdString = "0" + newObjectiveId;
  }
  const newGoalId = 1; //It was throwing an error when I just put 1 for newGoalId

  //Create copy of Objective #1
  let newObjective = JSON.parse(
    JSON.stringify(selectQuestion(state, `${year}-02-b-01-01-01`))
  );
  //update newObjectives traits so that it is objective n+1
  newObjective.id = `${year}-02-b-01-01-${objectiveIdString}`;
  newObjective.questions[0].answer.entry = null;
  newObjective.questions[0].answer.default_entry = null;
  newObjective.questions[0].answer.readonly = false;
  newObjective.questions[0].id = `${year}-02-b-01-01-${objectiveIdString}-01`;
  newObjective.questions[1].id = `${year}-02-b-01-01-${objectiveIdString}-02`;
  newObjective.questions[1].questions = [
    addNewGoal(newGoalId, objectiveIdString, year, state),
  ];
  return newObjective;
};

const addNewGoal = (newGoalId, objectiveId, year, state) => {
  let goalIdString = "";
  if (newGoalId < 9) {
    goalIdString = "0" + newGoalId;
  }
  //Create copy of Goal #1 in objective #1
  let newGoal = JSON.parse(
    JSON.stringify(selectQuestion(state, `${year}-02-b-01-01-01-02-01`))
  );
  newGoal.id = `${year}-02-b-01-01-${objectiveId}-02-${goalIdString}`;
  let count = 1;
  let subCount = 0;
  let tempGoalId = "";
  newGoal.questions.forEach((goal) => {
    if (count < 10) {
      tempGoalId = "0" + count;
    } else {
      tempGoalId = count;
    }

    if (goal.type === "fieldset") {
      subCount = 0;
      //handles synthesized values
      if (goal.fieldset_info) {
        let tempTarget = goal.fieldset_info.targets[0].split("-");
        goal.fieldset_info.targets[0] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
        tempTarget = goal.fieldset_info.targets[1].split("-");
        goal.fieldset_info.targets[1] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
      }
      //Handles fieldset with sub questions
      goal.questions.forEach((subquestion) => {
        let tempSubquestion = subquestion.id.split("-");
        subquestion.id = `${year}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${tempSubquestion[8]}`;
        subquestion.answer.entry = null;
        if (subquestion.context_data) {
          let tempTarget = subquestion.context_data.hide_if.target
            .split("-")[8]
            .subString(0, 2);
          subquestion.context_data.hide_if.target = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
        }
        subCount = subCount + 1;
        count = count + 1;
      });
    } else {
      goal.id = `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-${tempGoalId}`;
      goal.answer.entry = null;
      if (goal.questions) {
        subCount = 0;
        goal.questions.forEach((subquestion) => {
          let tempSubquestion = subquestion.id.split("-");
          subquestion.id = `${year}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${tempGoalId}-${tempSubquestion[9]}`;
          subquestion.answer.entry = null;
          if (subquestion.context_data.conditional_display.hide_if.target) {
            let tempTarget = subquestion.context_data.conditional_display.hide_if.target.split(
              "-"
            );
            subquestion.context_data.conditional_display.hide_if.target = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
          }

          subCount = subCount + 1;
        });
      }
      count = count + 1;
    }
  });
  return newGoal;
};

export { addNewGoal, addNewObjective };
