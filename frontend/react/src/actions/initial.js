import axios from "../authenticatedAxios";
import { getProgramData, getStateData, getUserData } from "../store/stateUser";

export const LOAD_SECTIONS = "LOAD SECTIONS";
export const GET_ALL_STATES_DATA = "GET_ALL_STATES_DATA";
export const SET_STATE_STATUS = "SET_STATE_STATUS";
export const SET_STATE_STATUSES = "SET_STATE_STATUSES";
export const QUESTION_ANSWERED = "QUESTION ANSWERED";

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

export const getAllStateStatuses = (selectedYears = [], selectedStates = [], selectedStatus = []) => async (dispatch, getState) => {
  
  const { data } = await axios.get(`/state_status/`);

  console.log("data",data)
  let yearFilter = () =>{};
  let stateFilter = () =>{};
  let statusFilter = () =>{}

  selectedYears.length > 0 ? 
  yearFilter =  (record) => selectedYears.includes(record.year) : 
  yearFilter = (record) => 1 === 1

  selectedStates.length > 0 ? 
  stateFilter =  (record) => selectedStates.includes(record.state) : 
  stateFilter = (record) => 1 === 1
  
  selectedStatus.length > 0 ? 
  statusFilter =  (record) => selectedStatus.includes(record.status) : 
  statusFilter = (record) => 1 === 1

  

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
        (status, index, original) => original.slice(index + 1).findIndex((el) =>el.state === status.state && el.year === status.year) <
        0)
        .reduce(
          (out, record) => ({
            ...out,
            [record.state+record.year]: {
              status:record.status,
              year:record.year,
              stateCode:record.state,
              lastChanged:record.last_changed,
              username:record.user_name,
            },
          }),
          {}
        );
      console.log("filtered payload",payload)
  dispatch({ type: SET_STATE_STATUSES, payload });
};

export const getStateStatus = ({ stateCode }) => async (dispatch, getState) => {
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

const getCookie = (key) => {
  const result = new RegExp(`(?:^|; ) ${encodeURIComponent(key)}=([^;]*)`).exec(
    document.cookie
  );
  return result ? result[1] : null;
};

export const loadUser = (userToken) => async (dispatch) => {
  dispatch({ type: "SIGN_IN_STARTED" });

  // *** make sure this cookie is present for all future django posts
  if (getCookie("csrftoken") === null) {
    await axios.get("/api/v1/initiate", { withCredentials: true });
  }

  const { data } = userToken
    ? await axios.get(`/api/v1/appusers/${userToken}`)
    : await axios.post(`/api/v1/appusers/auth`);

  dispatch({ type: "SIGN_IN_FINISHED" });

  await Promise.all([
    dispatch(getUserData(data.currentUser)),
    dispatch(getStateData(data)),
    dispatch(getProgramData(data)),
    dispatch(getStateStatus({ stateCode: data.abbr })),
    dispatch(getAllStatesData()),
  ]);
};

export const loadForm = (state) => async (dispatch, getState) => {
  const { stateUser } = getState();
  const stateCode = state ?? stateUser.currentUser.state.id;

  // Start isFetching for spinner
  dispatch({ type: "CONTENT_FETCHING_STARTED" });

  try {
    await dispatch(loadSections({ userData: stateUser, stateCode }));
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
