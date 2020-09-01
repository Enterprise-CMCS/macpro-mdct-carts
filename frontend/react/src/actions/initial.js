import axios from "axios";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

const temp__data = require("./initial.json");

export const loadSections = () => {
  return async (dispatch) => {
    // const { data } = await axios.get(
    //   `${window._env_.API_POSTGRES_URL}/api/v1/sections/2020/AK`
    // );
    // dispatch({ type: LOAD_SECTIONS, data });
    dispatch({ type: LOAD_SECTIONS, data: temp__data });
  };
};

// Move this to where actions should go when we know where that is.
export const setAnswerEntry = (fragmentId, something) => {
  const value =
    something.target && something.target.value
      ? something.target.value
      : something;
  return {
    type: QUESTION_ANSWERED,
    fragmentId: fragmentId,
    data: value,
  };
};
