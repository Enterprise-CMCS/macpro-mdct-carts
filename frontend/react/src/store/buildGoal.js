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
      }
      // *** handles fieldset with sub questions
      goal.questions.forEach((subquestion) => {
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
            subquestion.context_data.conditional_display.hide_if.target = generateId(
              subquestion.context_data.conditional_display.hide_if.target.split(
                "-"
              ),
              objectiveId,
              newGoalId
            );
          }
          subCount++;
        });
      }
      count++;
    }
  });
  return newGoal;
};
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
