import axios from "axios";
import fakeUserData from "../store/fakeUserData";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

/* eslint-disable no-underscore-dangle */

export const loadSections = ({ userData }) => {
  return async (dispatch) => {
    const { data } = await axios
      .get(
        `${window._env_.API_POSTGRES_URL}/api/v1/sections/2020/${userData.abbr}`
      )
      .catch((err) => {
        // Error-handling would go here. For now, just log it so we can see
        // it in the console, at least.
        console.log("--- ERROR LOADING SECTIONS ---");
        console.log(err);
        throw err;
      });

    dispatch({ type: LOAD_SECTIONS, data });
  };
};

export const loadUserThenSections = ({ userData }) => {
  const { userToken } = userData;
  return async (dispatch) => {
    await axios
      .get(`${window._env_.API_POSTGRES_URL}/api/v1/appusers/${userToken}`)
      .then((res) => {
        dispatch(loadSections({ userData: res.data }));
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
        dispatch(getUserData(res.data.currentUser));
        dispatch(getAllStatesData({ userData: res.data }));
      })
      .catch((err) => {
        /*
         * Error-handling would go here, but for now, since the anticipated
         * error is trying to run on cartsdemo, we just use the fake data.
         * This fake user data has AK/AZ/MA, just like the fake data on the
         * server. Log the error and proceed.
         */
        console.log("--- ERROR LOADING USER FROM API ---");
        console.log(err);

        const stateAbbr = userToken.split("-")[1].toUpperCase();
        const fakeUser = fakeUserData[stateAbbr];

        dispatch(loadSections({ userData }));
        dispatch(getProgramData(userData));
        dispatch(getStateData(userData));
        dispatch(getUserData(userData.currentUser));
      });
  };
};

export const secureLoadUserThenSections = ({ authState }) => {
  const xhrURL = `${window._env_.API_POSTGRES_URL}/api/v1/appusers/auth`;
  const xhrHeaders = {
    Authorization: `Bearer ${authState.accessToken}`,
  };

  return async (dispatch) => {
    await axios({ method: "POST", url: xhrURL, headers: xhrHeaders })
      .then((res) => {
        dispatch(loadSections({ userData: res.data }));
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
        dispatch(getUserData(res.data.currentUser));
      })
      .catch((err) => {
        /*
         * Error-handling would go here, but for now, since the anticipated
         * error is trying to run on cartsdemo, we just use the fake data.
         * This fake user data has AK/AZ/MA, just like the fake data on the server.
         */
        // Error-handling would go here. For now, just log it so we can see
        // it in the console, at least.
        console.log("--- ERROR SECURELY LOADING SECTIONS ---");
        console.log(err);
        throw err;
      });
  };
};

export const getAllStatesData = ({ userData }) => {
  return async (dispatch) => {
    const { data } = await axios
      .get(`${window._env_.API_POSTGRES_URL}/state/`)
      .catch((err) => {
        console.log("error:", err);
        console.dir(err);
      });

    dispatch({ type: GET_ALL_STATES_DATA, data });
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
    fragmentId,
    data: value,
  };
};
