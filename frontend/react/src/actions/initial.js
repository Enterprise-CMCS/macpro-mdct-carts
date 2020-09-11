import axios from "axios";
import fakeUserData from "../store/fakeUserData";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

const temp__data = require("./initial.json");

export const loadUserThenSections = ({userData}) => {
  const userToken = userData.userToken;
  return async (dispatch) => {
    const userFromServer = await axios.get(
      `${window._env_.API_POSTGRES_URL}/api/v1/appusers/${userToken}`
    )
      .then((res) => {
          dispatch(loadSections({userData: res.data}));
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
          dispatch(loadSections({userData: userData}))
          dispatch(getProgramData(userData));
          dispatch(getStateData(userData));
          dispatch(getUserData(userData.currentUser));
      })
      

  }

};

export const loadSections = ({userData}) => {
  return async (dispatch) => {
    const { data } = await axios.get(
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
          return {data: temp__data}
      })

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
