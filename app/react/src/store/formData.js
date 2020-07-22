const CURRENT_YEAR_DATA = "CURRENT_YEAR_DATA";

const initialState = {
    s2b_o1_g1_q1_question: "1. Briefly describe your goal",
    s2b_o1_g1_q1_hint:
      "For example: Enroll 75% of eligible children in the CHIP program.",
    s2b_o1_g1_q1_answer:
      "This is the text for section 2b, objective 1, Goal 1, Question1",
    s2b_o1_g1_q1_prev: "This is last years answer",

    s2b_o1_g1_q2_answer: "new",
    s2b_o1_g1_q3_answer: "Question3",
  },

const getCurrentData = (answerData) => ({
    type: CURRENT_YEAR_DATA,
    s2b_o1_g1_q1_answer: answerData
})
  // FORM DATA REDUCER
export default function (data = initialState, action) {
    switch (action.type) {
      case CURRENT_YEAR_DATA:
        return {
          ...data,
          s2b_o1_g1_q1_answer: action.answer,
        };
      default:
        return data;
    }
  }