import axios from "../authenticatedAxios";

export const UNCERTIFY = "UNCERTIFY";
export const UNCERTIFY_SUCCESS = "UNCERTIFY_SUCCESS";
export const UNCERTIFY_FAILURE = "UNCERTIFY_FAILURE";

export const theUncertify = (stateCode) => async (dispatch, getState) => {
  const state = getState();
  const user = state.stateUser.currentUser;
  const userName = `${user.firstname} ${user.lastname}`;
  const year = +state.global.formYear;

  // created a new record in carts_api_statestatus that will label the state as uncertified
  dispatch({ type: UNCERTIFY });
  try {
    await axios.post(`/state_status/`, {
      last_changed: new Date(),
      state: stateCode,
      status: "in_progress",
      user_name: userName,
      year,
    });
    dispatch({ type: UNCERTIFY_SUCCESS, stateCode: stateCode });
  } catch (e) {
    dispatch({ type: UNCERTIFY_FAILURE, message: { e } });
  }
};
