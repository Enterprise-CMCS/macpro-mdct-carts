import axios from "../authenticatedAxios";

export const ACCEPT = "ACCEPT";
export const ACCEPT_SUCCESS = "ACCEPT_SUCCESS";
export const ACCEPT_FAILURE = "ACCEPT_FAILURE";

export const theAccept = (stateCode, stateYear) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const user = state.stateUser.currentUser;
  const username = `${user.firstname} ${user.lastname}`;

  // created a new record in carts_api_statestatus that will label the state as accepted
  dispatch({ type: ACCEPT });
  try {
    await axios.post(`/state_status/`, {
      last_changed: new Date(),
      state: stateCode,
      status: "accepted",
      user_name: username,
      year: stateYear,
    });
    dispatch({ type: ACCEPT_SUCCESS, stateCode: stateCode });
  } catch (e) {
    dispatch({ type: ACCEPT_FAILURE, message: { e } });
  }
};
