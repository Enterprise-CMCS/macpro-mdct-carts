import { selectQuestion } from "../../../store/selectors";
import { setAnswer, setId } from "../../../actions/initial";
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
    return {
      type: "objective",
      id: `2020-02-b-01-01-${objectiveIdString}`,
      questions: [
        {
          type: "text_multiline",
          label: "What is your objective as listed in your state plan?",
          hint:
            "For example: Our objective is to increase enrollment in our CHIP program.",
          id: `2020-02-b-01-01-${objectiveIdString}-01`,
          answer: {
            readonly: false,
            default_entry: "",
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveIdString}-02`,
          type: "repeatables",
          questions: [this.addNewGoal(newGoalId, objectiveIdString)],
        },
      ],
    };
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
        goal.questions.forEach((subquestion) => {
          subquestion.id = `${year}-02-b-01-01-${objectiveId}-02-${goalIdString}-${tempGoalId}-${subQuestionLetter[subCount]}`;
          subquestion.answer.entry = null;
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
            subCount = subCount + 1;
          });
        }
      }
    });
    //Returns all 12 questions for a new goal
    return {
      id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}`,
      type: "repeatable",
      questions: [
        
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-02`,
          label: "What type of goal is it?",
          type: "radio",
          answer: {
            options: [
              { label: "New goal", value: "goal_new" },
              { label: "Continuing goal", value: "goal_continuing" },
              { label: "Discontinued goal", value: "goal_discontinued" },
            ],
            default_entry: "goal_new",
            entry: null,
          },
          questions: [
            {
              id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-02-a`,
              label: "Why was this goal discontinued?",
              type: "text_multiline",
              answer: {
                entry: null,
              },
              context_data: {
                conditional_display: {
                  type: "conditional_display",
                  comment: `Interactive: Hide if 2020-02-b-01-01-${objectiveId}-02-${goalIdString}-02 is null, continuing goal, or new goal; noninteractive: hide if that's continuing goal or new goal.`,
                  hide_if: {
                    target: `$..*[?(@.id=="2020-02-b-01-01-${objectiveId}-02-${goalIdString}-02")].answer.entry`,
                    values: {
                      interactive: [null, "goal_continuing", "goal_new"],
                      noninteractive: ["goal_continuing", "goal_new"],
                    },
                  },
                },
              },
            },
          ],
        },
        {
          type: "fieldset",
          label: "Define the numerator you're measuring",
          questions: [
            {
              id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-03`,
              label: "Which population are you measuring in the numerator?",
              hint:
                "For example: The number of children enrolled in CHIP in the last federal fiscal year.",
              type: "integer",
              answer: {
                entry: null,
              },
            },
            {
              id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-04`,
              label: "Numerator (total number)",
              type: "integer",
              answer: {
                entry: null,
              },
            },
          ],
        },
        {
          type: "fieldset",
          label: "Define the denominator you're measuring",
          questions: [
            {
              id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-05`,
              label: "Which population are you measuring in the denominator?",
              hint:
                "For example: The total number of eligible children in the last federal fiscal year.",
              type: "integer",
              answer: {
                entry: null,
              },
            },
            {
              id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-06`,
              label: "Denominator (total number)",
              type: "integer",
              answer: {
                entry: null,
              },
            },
          ],
        },
        {
          type: "fieldset",
          fieldset_type: "synthesized_value",
          fieldset_info: {
            targets: [
              `$..*[?(@.id=='2020-02-b-01-01-${objectiveId}-02-${goalIdString}-04')].answer.entry`,
              `$..*[?(@.id=='2020-02-b-01-01-${objectiveId}-02-${goalIdString}-06')].answer.entry`,
            ],
            actions: ["percentage"],
          },
          questions: [],
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-07`,
          label: "What is the date range of your data?",
          type: "daterange",
          answer: {
            labels: ["Start", "End"],
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-08`,
          label: "Which data source did you use?",
          type: "radio",
          answer: {
            options: [
              {
                label: "Eligibility or enrollment data",
                value: "goal_enrollment_data",
              },
              { label: "Survey data", value: "goal_survey_data" },
              { label: "Another data source", value: "goal_other_data" },
            ],
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-09`,
          label:
            "How did your progress towards your goal last year compare to your previous year\u2019s progress?",
          type: "text_multiline",
          answer: {
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-10`,
          label:
            "What are you doing to continually make progress towards your goal?",
          type: "text_multiline",
          answer: {
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-11`,
          label: "Anything else you'd like to tell us about this goal?",
          type: "text_multiline",
          answer: {
            entry: null,
          },
        },
        {
          id: `2020-02-b-01-01-${objectiveId}-02-${goalIdString}-12`,
          label: "Do you have any supporting documentation?",
          hint: "Optional",
          type: "file_upload",
          answer: {
            entry: null,
          },
        },
      ],
    };
  };
}
const mapStateToProps = (state) => ({
  state: state,
});

const mapDispatchToProps = {
  setTheId: setId,
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveAndGoals);
