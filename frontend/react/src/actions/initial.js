import axios from "axios";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";
import forwardedQueryString from "../util/devQueryString";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

/* eslint-disable no-underscore-dangle, no-console */

export const getAllStatesData = () => {
  return async (dispatch) => {
    const { data } = await axios
      .get(`${window.env.API_POSTGRES_URL}/state/${forwardedQueryString()}`)
      .catch((err) => {
        console.log("error:", err);
        console.dir(err);
      });

    dispatch({ type: GET_ALL_STATES_DATA, data });
  };
};

export const loadSections = ({ userData, headers, stateCode }) => {
  const xhrHeaders = headers || {};
  const apiHost = window.env.API_POSTGRES_URL;
  const apiPath = "/api/v1/sections/2020/";
  const state = stateCode || userData.abbr;
  const queryString = forwardedQueryString();
  const apiURL = [apiHost, apiPath, state, queryString].join("");
  return async (dispatch) => {
    const { data } = await axios({
      method: "GET",
      url: apiURL,
      headers: xhrHeaders,
    }).catch((err) => {
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
  const apiHost = window.env.API_POSTGRES_URL;
  const apiPath = "/api/v1/appusers/";
  const queryString = forwardedQueryString();
  const apiURL = [apiHost, apiPath, userToken, queryString].join("");
  return async (dispatch) => {
    await axios
      .get(apiURL)
      .then((res) => {
        dispatch(loadSections({ userData: res.data, stateCode }));
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
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

export const secureLoadUserThenSections = ({
  authState,
  authService,
  stateCode,
}) => {
  const xhrURL = `${
    window.env.API_POSTGRES_URL
  }/api/v1/appusers/auth${forwardedQueryString()}`;
  const xhrHeaders = {
    Authorization: `Bearer ${authState.accessToken}`,
  };

  return async (dispatch) => {
    await axios({ method: "POST", url: xhrURL, headers: xhrHeaders })
      .then((res) => {
        /* The order here is important because in the cases where there's
         * no state info (e.g. admin users) the current loadSections code
         * will error out, which we need to change once we're completely
         * away from using various kinds of fake users.
         * The same applies to needing to eliminate the mostly-redundant
         * functions in this file that apply to non-secure loading.
         */
        dispatch(getUserData(res.data.currentUser));
        dispatch(
          loadSections({ userData: res.data, headers: xhrHeaders, stateCode })
        );
        dispatch(getProgramData(res.data));
        dispatch(getStateData(res.data));
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
        //authService.logout("/");
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
