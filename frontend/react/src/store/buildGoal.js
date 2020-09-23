import { selectQuestion } from "./selectors";
/************************************************************************************
 * Function: buildGoal()
 *
 *
 * @param newGoalId           -- (string) -- id of the new goal
 * @param objectiveId         -- (string) -- id of the current objective
 * @param parentObjectiveId   -- (string) -- id of the parent objective
 * @param state               -- (string) -- current state
 *
 * @returns                   -- (jSON)   -- generated goal
 ************************************************************************************/
export const buildGoal = (newGoalId, objectiveId, parentObjectiveId, state) => {
<<<<<<< HEAD
  // *** make sure goal is zero padded to 2 digits if less than 10
  newGoalId = newGoalId.toString().padStart(2, "0");
  // *** string to append to generated objective id
  const firstObjectiveAndGoal = "01-02-01";
  // *** length of substring to be pulled out of parent objective id
  const parentIdCutoffSubscript = 5;
  // *** repeatables id needed for building goal ids
  const repeatablesId = "02";
  // *** generate new objective id
  let newGoal = JSON.parse(
    JSON.stringify(
      selectQuestion(
        state,
        `${parentObjectiveId
          .split("-")
          .slice(0, parentIdCutoffSubscript)
          .join("-")}-${firstObjectiveAndGoal}`
=======
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
>>>>>>> 6a471771b32150c1ae3e8ef6a5f6e6cbdd9e07a2
      )
    )
  );
  // *** generate goal id
  const goalIdPartsArray = newGoal.id.split("-");
  newGoal.id = `${goalIdPartsArray
    .slice(0, parentIdCutoffSubscript)
    .join("-")}-${objectiveId}-${goalIdPartsArray[6]}-${newGoalId}`;
  // *** initialize counters
  let count = 1;
  let subCount = 0;
  newGoal.questions.forEach((goal) => {
    const countGoalId = count.toString().padStart(2, "0");
    // *** if a goal is a fieldset ...
    if (goal.type === "fieldset") {
      // *** if goal.fieldset_info is missing, quit current iteration (continue loop)
      /*if (!goal.fieldset_info) {
        //this skips all fieldsets with sub questions
        return;
      }*/
      // *** ... reset sub-count
      subCount = 0;
<<<<<<< HEAD
      // *** handles synthesized values (only if fieldset info is present)
      if (goal.fieldset_type === "synthesized_value") {
        const amountOfGoalsToGenerate = 2;
        // ** generate initial amount of goals according to the value specified above
        for (let i = 0; i < amountOfGoalsToGenerate; i++) {
          goal.fieldset_info.targets[i] = generateId(
            goal.fieldset_info.targets[i].split("-"),
            objectiveId,
            newGoalId
          );
        }
=======
      //handles synthesized values
      if (goal.fieldset_info && goal.fieldset_type === "synthesized_value") {
        let tempTarget = goal.fieldset_info.targets[0].split("-");
        goal.fieldset_info.targets[0] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
        tempTarget = goal.fieldset_info.targets[1].split("-");
        goal.fieldset_info.targets[1] = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
>>>>>>> 6a471771b32150c1ae3e8ef6a5f6e6cbdd9e07a2
      }
      // *** handles fieldset with sub questions
      goal.questions.forEach((subquestion) => {
<<<<<<< HEAD
        const generatedSubquestionId = subquestion.id.split("-");
        subquestion.id = generateId(
          generatedSubquestionId,
          objectiveId,
          newGoalId
        );
        subquestion.answer.entry = null;
        if (subquestion.context_data) {
          subquestion.context_data.hide_if.target = generateId(
            subquestion.context_data.hide_if.target.split("-")[8].substr(0, 2),
            objectiveId,
            newGoalId
          );
=======
        let tempSubquestion = subquestion.id.split("-");
        subquestion.id = `${tempSubquestion[0]}-${tempSubquestion[1]}-${tempSubquestion[2]}-${tempSubquestion[3]}-${tempSubquestion[4]}-${objectiveId}-${tempSubquestion[6]}-${goalIdString}-${tempSubquestion[8]}`;
        subquestion.answer.entry = null;
        if (subquestion.context_data) {
          let tempTarget = subquestion.context_data.hide_if.target
            .split("-")[8]
            .subString(0, 2);
          subquestion.context_data.hide_if.target = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
>>>>>>> 6a471771b32150c1ae3e8ef6a5f6e6cbdd9e07a2
        }
        subCount++;
        count++;
      });
    } else {
      goal.id = `${parentObjectiveId
        .split("-")
        .slice(0, parentIdCutoffSubscript)
        .join(
          "-"
        )}-${objectiveId}-${repeatablesId}-${newGoalId}-${countGoalId}`;
      goal.answer.entry = null;
      // *** if goal has questions associated with it ...
      if (goal.questions) {
        // *** ...reset sub-count
        subCount = 0;
        // *** traverse questions
        goal.questions.forEach((subquestion) => {
          let generatedSubquestionId = subquestion.id.split("-");
          subquestion.id = `${generatedSubquestionId
            .slice(0, parentIdCutoffSubscript)
            .join("-")}-${objectiveId}-${
            generatedSubquestionId[6]
          }-${newGoalId}-${countGoalId}-${generatedSubquestionId[9]}`;

          subquestion.answer.entry = null;
          if (subquestion.context_data.conditional_display.hide_if.target) {
<<<<<<< HEAD
            subquestion.context_data.conditional_display.hide_if.target = generateId(
              subquestion.context_data.conditional_display.hide_if.target.split(
                "-"
              ),
              objectiveId,
              newGoalId
            );
=======
            let tempTarget = subquestion.context_data.conditional_display.hide_if.target.split(
              "-"
            );
            subquestion.context_data.conditional_display.hide_if.target = `${tempTarget[0]}-${tempTarget[1]}-${tempTarget[2]}-${tempTarget[3]}-${tempTarget[4]}-${objectiveId}-${tempTarget[6]}-${goalIdString}-${tempTarget[8]}`;
>>>>>>> 6a471771b32150c1ae3e8ef6a5f6e6cbdd9e07a2
          }
          subCount++;
        });
      }
      count++;
    }
  });
  return newGoal;
};
<<<<<<< HEAD
/************************************************************************************
 * Function: generateId()
 *
 *
 * @param parentIdPartsArray  -- (string[]) -- array with parent id broken into individual members
 * @param objectiveId         -- (string)   -- id of the current objective
 * @param goalId              -- (string)   -- id of the goal
 *
 * @returns                   -- (jSON)     -- generated id
 ************************************************************************************/
export const generateId = (parentIdPartsArray, objectiveId, goalId) => {
  const parentIdCutoffSubscript = 5;
  return `${parentIdPartsArray
    .slice(0, parentIdCutoffSubscript)
    .join("-")}-${objectiveId}-${parentIdPartsArray[6]}-${goalId}-${
    parentIdPartsArray[8]
  }`;
};
=======
>>>>>>> 6a471771b32150c1ae3e8ef6a5f6e6cbdd9e07a2
