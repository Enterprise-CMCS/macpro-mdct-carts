import axios from "axios";
import fakeUserData from "../store/fakeUserData";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";
import { selectQuestion } from "../store/selectors";
import { buildGoal } from "../store/buildGoal";
export const LOAD_SECTIONS = "LOAD SECTIONS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";
export const QUESTION_ADDED = "QUESTION ADDED";

const temp__data = require("./initial.json");

export const loadUserThenSections = ({ userData }) => {
  const userToken = userData.userToken;
  return async (dispatch) => {
    const userFromServer = await axios
      .get(`${window._env_.API_POSTGRES_URL}/api/v1/appusers/${userToken}`)
      .then((res) => {
        dispatch(loadSections({ userData: res.data }));
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
        dispatch(getUserData(res.data.currentUser));
      })
      .catch((res) => {
        /*
         * Error-handling would go here, but for now, since the anticipated
         * error is trying to run on cartsdemo, we just use the fake data.
         * This fake user data has AK/AZ/MA, just like the fake data on the server.
         */
        const stateAbbr = userToken.split("-")[1].toUpperCase();
        const userData = fakeUserData[stateAbbr];
        dispatch(loadSections({ userData: userData }));
        dispatch(getProgramData(userData));
        dispatch(getStateData(userData));
        dispatch(getUserData(userData.currentUser));
      });
  };
};

export const loadSections = ({ userData }) => {
  return async (dispatch) => {
    const { data } = await axios
      .get(
        `${window._env_.API_POSTGRES_URL}/api/v1/sections/2020/${userData.abbr}`
      )
      .catch((res) => {
        /*
         * Error-handling would go here, but for now, since the anticipated
         * error is trying to run on cartsdemo, we just use the fake data.
         * This fake data is only for AK, so if we fail to load it we'll
         * potentially see the user for a different state but the answers
         * from the AK fake data.
         */
        return { data: temp__data };
      });

    dispatch({ type: LOAD_SECTIONS, data });
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

export const addElement = (parentId, element) => {
  const value =
    element.target && element.target.value ? element.target.value : element;
  return {
    type: QUESTION_ADDED,
    parentId: parentId,
    data: value,
  };
};

export const addNewObjective = (parentID, newObjectiveId, firstObjectiveId) => (
  dispatch,
  getState
) => {
  const state = getState();
  let objectiveIdString = newObjectiveId;
  if (newObjectiveId < 10) {
    objectiveIdString = "0" + newObjectiveId;
  }
  const newGoalId = 1; //It was throwing an error when I just put 1 for newGoalId
  const tempFirstObjectiveId = firstObjectiveId.split("-");
  //Create copy of Objective #1
  let newObjective = JSON.parse(
    JSON.stringify(
      selectQuestion(
        state,
        `${tempFirstObjectiveId[0]}-${tempFirstObjectiveId[1]}-${tempFirstObjectiveId[2]}-${tempFirstObjectiveId[3]}-${tempFirstObjectiveId[4]}-${tempFirstObjectiveId[5]}`
      )
    )
  );
  const tempNewObjectiveId = newObjective.id.split("-");
  //update newObjectives traits so that it is objective n+1
  newObjective.id = `${tempFirstObjectiveId[0]}-${tempNewObjectiveId[1]}-${tempNewObjectiveId[2]}-${tempNewObjectiveId[3]}-${tempNewObjectiveId[4]}-${objectiveIdString}`;
  newObjective.questions[0].answer.entry = null;
  newObjective.questions[0].answer.default_entry = null;
  newObjective.questions[0].answer.readonly = false;
  newObjective.questions[0].id = `${tempFirstObjectiveId[0]}-${tempNewObjectiveId[1]}-${tempNewObjectiveId[2]}-${tempNewObjectiveId[3]}-${tempNewObjectiveId[4]}-${objectiveIdString}-01`;
  newObjective.questions[1].id = `${tempFirstObjectiveId[0]}-${tempNewObjectiveId[1]}-${tempNewObjectiveId[2]}-${tempNewObjectiveId[3]}-${tempNewObjectiveId[5]}-${objectiveIdString}-02`;
  newObjective.questions[1].questions = [
    buildGoal(newGoalId, objectiveIdString, newObjective.id, state),
  ];
  dispatch(addElement(parentID, newObjective));
};

export const addNewGoal = (newGoalId, objectiveId, parentObjectiveId) => (
  dispatch,
  getState
) => {
  const state = getState();
  const newGoal = buildGoal(newGoalId, objectiveId, parentObjectiveId, state);
  dispatch(addElement(parentObjectiveId, newGoal));
};
