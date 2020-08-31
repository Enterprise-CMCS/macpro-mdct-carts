import axios from "axios";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

export const loadSections = () => {
  return async (dispatch) => {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/sections/2020/AK`
    );
    console.log("data", data);
    dispatch({ type: LOAD_SECTIONS, data });
  };
};

// Move this to where actions should go when we know where that is.
export const setAnswerEntry = (fragmentId, something) => {
  console.log("setAnswer");
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
