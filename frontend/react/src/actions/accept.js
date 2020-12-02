import axios from "../authenticatedAxios";

export const ACCEPT = "ACCEPT";
export const ACCEPT_SUCCESS = "ACCEPT_SUCCESS";
export const ACCEPT_FAILURE = "ACCEPT_FAILURE";

export const theAccept = (stateCode) => async (dispatch, getState) => {
  const state = getState();
  const user = state.stateUser.currentUser;
  const userName = `${user.firstname} ${user.lastname}`;
  const year = +state.global.formYear;

  // created a new record in carts_api_statestatus that will label the state as accepted
  dispatch({ type: ACCEPT });
  try {
    await axios.post(`/state_status/`, {
      last_changed: new Date(),
      state: stateCode,
      status: "accepted",
      user_name: userName,
      year,
    });
    dispatch({ type: ACCEPT_SUCCESS, stateCode: stateCode });
  } catch (e) {
    dispatch({ type: ACCEPT_FAILURE, message: { e } });
  }
};
