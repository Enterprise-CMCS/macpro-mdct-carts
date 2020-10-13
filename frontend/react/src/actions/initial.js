import axios from "../axios";
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

export const getStateStatus = ({ stateCode }) => async (dispatch) => {
  const { data } = await axios.get(`/state_status/`);

  // Get the latest status for this state.
  // TODO: Need to also check for the correct year, but since the year is
  // hardcoded elsewhere right now, it doesn't seem like the right time to
  // fix that here...
  const payload = data
    .reverse()
    .find((status) => status.state.endsWith(`/state/${stateCode}/`));

  if (payload) {
    dispatch({
      type: SET_STATE_STATUS,
      payload,
    });
  } else {
    const { data: newData } = await axios.post(`/state_status/`, {
      state: `${window.env.API_POSTGRES_URL}/state/${stateCode}/`,
      year: 2020,
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

export const loadUserThenSections = ({ userData, stateCode }) => {
  const { userToken } = userData;

  return async (dispatch) => {
    await axios
      .get(`/api/v1/appusers/${userToken}`)
      .then((res) => {
        dispatch(loadSections({ userData: res.data, stateCode }));
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
        dispatch(getStateStatus({ stateCode }));
        dispatch(getUserData(res.data.currentUser));
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

        dispatch(loadSections({ userData }));
        dispatch(getProgramData(userData));
        dispatch(getStateData(userData));
        dispatch(getUserData(userData.currentUser));
      });
  };
};

export const secureLoadUserThenSections = () => {
  return async (dispatch) => {
    await axios
      .post("/api/v1/appusers/auth")
      .then(({ data }) => {
        /* The order here is important because in the cases where there's
         * no state info (e.g. admin users) the current loadSections code
         * will error out, which we need to change once we're completely
         * away from using various kinds of fake users.
         * The same applies to needing to eliminate the mostly-redundant
         * functions in this file that apply to non-secure loading.
         */
        const stateCode = data.currentUser.state.id;

        dispatch(getUserData(data.currentUser));
        dispatch(loadSections({ userData: data, stateCode }));
        dispatch(getStateStatus({ stateCode }));
        dispatch(getProgramData(data));
        dispatch(getStateData(data));
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
        /*
         * TODO: fix the issue underlying the following--without it, we end up
         * in a weird state where the frontend thinks we're logged in, but the
         * backend auth fails, so that the logout button isn't available but we
         * can't get backend authorization. This crude fix forces logout if the
         * backend calls fail, which is fragile in other ways.
         */
        // authService.logout("/");
        throw err;
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
