import { selectQuestion } from "./selectors";

export const buildGoal = (newGoalId, objectiveId, parentObjectiveId, state) => {
  let goalIdString = newGoalId;
  if (newGoalId < 10) {
    goalIdString = "0" + newGoalId;
  }
  const tempParentObjectiveId = parentObjectiveId.split("-");
  //["2020", "02", "b", "01", "01", "01", "02"] new goal for obj 1
  //["2020", "02", "b", "01", "01", "02"] new objective
  //["2020", "02", "b", "01", "01", "02", "02"] new goal obj 2

  const firstObjectiveAndGoal = "01-02-01";
  let newGoal = JSON.parse(
    JSON.stringify(
      selectQuestion(
        state, //Hard coded the 01 so that when adding a new objective or new goal, you get the first goal from the first objective
        `${tempParentObjectiveId[0]}-${tempParentObjectiveId[1]}-${tempParentObjectiveId[2]}-${tempParentObjectiveId[3]}-${tempParentObjectiveId[4]}-` +
          firstObjectiveAndGoal
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

        goal.fieldset_info.targets[0] = buildId(
          tempTarget,
          objectiveId,
          goalIdString
        );
        //`${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
        tempTarget = goal.fieldset_info.targets[1].split("-");
        goal.fieldset_info.targets[1] = buildId(
          tempTarget,
          objectiveId,
          goalIdString
        );
        //`${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
      }
      //Handles fieldset with sub questions
      goal.questions.forEach((subquestion) => {
        let tempSubquestion = subquestion.id.split("-");
        subquestion.id = buildId(tempSubquestion, objectiveId, goalIdString);
        // `${tempSubquestion[0]}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${tempSubquestion[8]}`;
        subquestion.answer.entry = null;
        if (subquestion.context_data) {
          let tempTarget = subquestion.context_data.hide_if.target
            .split("-")[8]
            .subString(0, 2);
          subquestion.context_data.hide_if.target = buildId(
            tempTarget,
            objectiveId,
            goalIdString
          );
          //`${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
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
            subquestion.context_data.conditional_display.hide_if.target = buildId(
              tempTarget,
              objectiveId,
              goalIdString
            );
            //`${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
          }

          subCount = subCount + 1;
        });
      }
      count = count + 1;
    }
  });
  return newGoal;
};

export const buildId = (currentItemArray, objectiveId, goalId) =>
  `${currentItemArray[0]}-${currentItemArray[1]}-${currentItemArray[2]}-${currentItemArray[3]}-${currentItemArray[4]}-${objectiveId}-${currentItemArray[6]}-${goalId}-${currentItemArray[8]}`;
