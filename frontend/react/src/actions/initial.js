import axios from "../authenticatedAxios";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const SET_STATE_STATUS = "SET_STATE_STATUS";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

/* eslint-disable no-underscore-dangle, no-console */

export const getAllStatesData = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/state/");
      dispatch({ type: GET_ALL_STATES_DATA, data });
    } catch (err) {
      console.log("error:", err);
      console.dir(err);
    }
  };
};

export const getStateStatus = ({ stateCode }) => async (dispatch, getState) => {
  const { data } = await axios.get(`/state_status/`);
  const year = +getState().global.formYear;

  // Get the latest status for this state.
  const payload = data
    .filter(
      (status) =>
        status.state.endsWith(`/state/${stateCode}/`) && status.year === year
    )
    .sort((a, b) => {
      const dateA = new Date(a.last_changed);
      const dateB = new Date(b.last_changed);

      if (dateA > dateB) {
        return 1;
      }
      if (dateA < dateB) {
        return -1;
      }
      return 0;
    })
    .pop();

  if (payload) {
    dispatch({
      type: SET_STATE_STATUS,
      payload,
    });
  } else {
    const { data: newData } = await axios.post(`/state_status/`, {
      state: `${window.env.API_POSTGRES_URL}/state/${stateCode}/`,
      year,
    });
    dispatch({ type: SET_STATE_STATUS, payload: newData });
  }
};

export const loadSections = ({ userData, stateCode }) => {
  const state = stateCode || userData.abbr;

  return async (dispatch) => {
    const { data } = await axios
      .get(`/api/v1/sections/2020/${state}`)
      .catch((err) => {
        // Error-handling would go here. For now, just log it so we can see
        // it in the console, at least.
        console.log("--- ERROR LOADING SECTIONS ---");
        console.log(err);
        // Without the following too many things break, because the
        // entire app is too dependent on section data being present.
        dispatch({ type: LOAD_SECTIONS, data: [] });
        throw err;
      });

    dispatch({ type: LOAD_SECTIONS, data });
  };
};

export const loadUserThenSections = (userToken) => {
  const getUser = async () =>
    userToken
      ? axios.get(`/api/v1/appusers/${userToken}`)
      : axios.post(`/api/v1/appusers/auth`);

  return async (dispatch) => {
    await getUser()
      .then(({ data }) => {
        const stateCode = data.currentUser.state.id;
        dispatch(loadSections({ userData: data, stateCode }));
        dispatch(getProgramData(data));
        dispatch(getStateData(data));
        dispatch(getStateStatus({ stateCode }));
        dispatch(getUserData(data.currentUser));
        dispatch(getAllStatesData());
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
      });
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
