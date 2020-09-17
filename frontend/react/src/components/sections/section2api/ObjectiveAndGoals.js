import { selectQuestion } from "../../../store/selectors";
import { setAnswer } from "../../../actions/initial";
import React, { Component } from "react";
import { connect } from "react-redux";
import { addElement } from "../../../actions/initial";

export const buildGoal = (newGoalId, objectiveId, parentObjectiveId, state) => {
  let goalIdString = newGoalId;
  if (newGoalId < 10) {
    goalIdString = "0" + newGoalId;
  }
  const tempParentObjectiveId = parentObjectiveId.split("-");
  //Create copy of Goal #1 in objective #1
  let newGoal = JSON.parse(
    JSON.stringify(
      selectQuestion(
        state, //The hard coded numbers are the first objectives and first goal
        `${tempParentObjectiveId[0]}-${tempParentObjectiveId[1]}-${tempParentObjectiveId[2]}-01-01-01-02-01`
      )
    )
  );
  const tempGoalId = newGoal.id.split("-");
  newGoal.id = `${tempGoalId[0]}-${tempGoalId[1]}-${tempGoalId[2]}-${tempGoalId[3]}-${tempGoalId[4]}-${objectiveId}-${tempGoalId[6]}-${goalIdString}`;
  let count = 1;
  let subCount = 0;
  let countGoalId = "";
  newGoal.questions.forEach((goal) => {
    if (count < 10) {
      countGoalId = "0" + count;
    } else {
      countGoalId = count;
    }

    if (goal.type === "fieldset") {
      subCount = 0;
      //handles synthesized values
      if (goal.fieldset_info && goal.fieldset_type === "synthesized_value") {
        let tempTarget = goal.fieldset_info.targets[0].split("-");
        goal.fieldset_info.targets[0] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
        tempTarget = goal.fieldset_info.targets[1].split("-");
        goal.fieldset_info.targets[1] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
      }
      //Handles fieldset with sub questions
      goal.questions.forEach((subquestion) => {
        let tempSubquestion = subquestion.id.split("-");
        subquestion.id = `${tempSubquestion[0]}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${tempSubquestion[8]}`;
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
      goal.id = `${tempParentObjectiveId[0]}-${tempParentObjectiveId[1]}-${tempParentObjectiveId[2]}-${tempParentObjectiveId[3]}-${tempParentObjectiveId[4]}-${objectiveId}-02-${goalIdString}-${countGoalId}`;
      goal.answer.entry = null;
      if (goal.questions) {
        subCount = 0;
        goal.questions.forEach((subquestion) => {
          let tempSubquestion = subquestion.id.split("-");
          subquestion.id = `${tempSubquestion[0]}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${countGoalId}-${tempSubquestion[9]}`;
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
