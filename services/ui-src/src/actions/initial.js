/* eslint-disable no-underscore-dangle, no-console */
import axios from "../authenticatedAxios";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const SET_STATE_STATUS = "SET_STATE_STATUS";
export const SET_STATE_STATUSES = "SET_STATE_STATUSES";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";
export const LOAD_LASTYEAR_SECTIONS = "LOAD_LASTYEAR_SECTIONS";

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

export const getAllStateStatuses =
  (selectedYears = [], selectedStates = [], selectedStatus = []) =>
  async (dispatch) => {
    const { data } = await axios.get(`/state_status/`);

    let yearFilter = () => {};
    let stateFilter = () => {};
    let statusFilter = () => {};

    selectedYears.length > 0
      ? (yearFilter = (record) => selectedYears.includes(record.year))
      : (yearFilter = () => true);

    selectedStates.length > 0
      ? (stateFilter = (record) => selectedStates.includes(record.state))
      : (stateFilter = () => true);

    selectedStatus.length > 0
      ? (statusFilter = (record) => selectedStatus.includes(record.status))
      : (statusFilter = () => true);

    const payload = data
      .filter(yearFilter)
      .filter(stateFilter)
      .filter(statusFilter)
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
      .filter(
        (status, index, original) =>
          original
            .slice(index + 1)
            .findIndex(
              (el) => el.state === status.state && el.year === status.year
            ) < 0
      )
      .reduce(
        (out, record) => ({
          ...out,
          [record.state + record.year]: {
            status: record.status,
            year: record.year,
            stateCode: record.state,
            lastChanged: record.last_changed,
            username: record.user_name,
          },
        }),
        {}
      );
    dispatch({ type: SET_STATE_STATUSES, payload });
  };

export const getStateAllStatuses =
  (selectedYears = [], selectedStates = [], selectedStatus = []) =>
  async (dispatch) => {
    const { data } = await axios.get(`/state_status/`);

    let yearFilter = () => {};
    let stateFilter = () => {};
    let statusFilter = () => {};

    selectedYears.length > 0
      ? (yearFilter = (record) => selectedYears.includes(record.year))
      : (yearFilter = () => true);

    selectedStates.length > 0
      ? (stateFilter = (record) => selectedStates.includes(record.state))
      : (stateFilter = () => true);

    selectedStatus.length > 0
      ? (statusFilter = (record) => selectedStatus.includes(record.status))
      : (statusFilter = () => true);

    const payload = data
      .filter(yearFilter)
      .filter(stateFilter)
      .filter(statusFilter)
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
      .filter(
        (status, index, original) =>
          original
            .slice(index + 1)
            .findIndex(
              (el) => el.state === status.state && el.year === status.year
            ) < 0
      )
      .reduce(
        (out, record) => ({
          ...out,
          [record.state + record.year]: {
            status: record.status,
            year: record.year,
            stateCode: record.state,
            lastChanged: record.last_changed,
            username: record.user_name,
          },
        }),
        {}
      );
    dispatch({ type: SET_STATE_STATUSES, payload });
  };

export const getStateStatus =
  ({ stateCode }) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`/state_status/`);
    const year = +getState().global.formYear;

    // Get the latest status for this state.
    const payload = data
      .filter((status) => status.state === stateCode && status.year === year)
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
        last_changed: new Date(),
        state: stateCode,
        status: "in_progress",
        year,
      });
      dispatch({ type: SET_STATE_STATUS, payload: newData });
    }
  };

export const loadSections = ({ userData, stateCode, selectedYear }) => {
  const state = stateCode || userData.abbr;
  return async (dispatch) => {
    const { data } = await axios
      .get(`/api/v1/sections/${selectedYear}/${state}`)
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

    const lastYear = parseInt(selectedYear) - 1;
    let lastYearData = undefined;
    if (lastYear % 2 === 0) {
      const data = await axios
        .get(`/api/v1/sections/${lastYear}/${state}`)
        .catch((err) => {
          // Error-handling would go here. For now, just log it so we can see
          // it in the console, at least.
          console.log("--- ERROR LOADING SECTIONS ---");
          console.log(err);
          // Without the following too many things break, because the
          // entire app is too dependent on section data being present.
          //dispatch({ type: LOAD_LASTYEAR_SECTIONS, data: [] });
          dispatch({ type: LOAD_SECTIONS, data, lastYearData });
          throw err;
        });
      if (data.data.length > 0) {
        lastYearData = data;
        dispatch({ type: LOAD_LASTYEAR_SECTIONS, data: data.data });
      }
    }
    dispatch({ type: LOAD_SECTIONS, data, lastYearData });
  };
};

export const loadUser = (user) => async (dispatch) => {
  const flattenedUser = {
    username: user.attributes.email,
    state: {
      id: user.attributes["custom:cms_state"],
    },
    role: user.attributes["custom:cms_roles"],
    lastname: user.attributes?.family_name,
    firstname: user.attributes?.given_name,
    email: user.attributes?.email,
  };
  // TODO: bring in info for state and program
  await Promise.all([
    dispatch(getUserData(flattenedUser)),
    dispatch(getStateData({ abbr: user.attributes["custom:cms_state"] })),
    dispatch(getProgramData(user)),
    dispatch(
      getStateAllStatuses({ stateCode: user?.attributes["custom:cms_state"] })
    ),
    dispatch(getAllStatesData()),
  ]);
};

export const loadForm = (state) => async (dispatch, getState) => {
  const { stateUser } = getState();
  const stateCode = state ?? stateUser.currentUser.state.id;
  let selectedYear = window.location.pathname.split("/")[2];
  if (window.location.pathname.includes("views")) {
    selectedYear = window.location.pathname.split("/")[4];
  }

  // Start isFetching for spinner
  dispatch({ type: "CONTENT_FETCHING_STARTED" });

  try {
    await dispatch(
      loadSections({ userData: stateUser, stateCode, selectedYear })
    );
  } finally {
    // End isFetching for spinner
    dispatch({ type: "CONTENT_FETCHING_FINISHED" });
  }
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
