import axios from "../authenticatedAxios";

export const UNCERTIFY = "UNCERTIFY";
export const UNCERTIFY_SUCCESS = "UNCERTIFY_SUCCESS";
export const UNCERTIFY_FAILURE = "UNCERTIFY_FAILURE";

export const theUncertify = () => async (dispatch, getState) => {
  const state = getState();
  const user = state.stateUser.currentUser;
  const stateCode = state.stateUser.abbr;
  const userName = 'tim youknowwho'//`${user.firstname} ${user.lastname}`;
  const year = +state.global.formYear;

  dispatch({ type: UNCERTIFY });
  try {
    await axios.post(`/state_status/`, {
      last_changed: new Date(),
      state: stateCode,
      status: "uncertified",
      user_name: userName,
      year,
    });
    dispatch({ type: UNCERTIFY_SUCCESS, user: userName });
  } catch (e) {
    dispatch({ type: UNCERTIFY_FAILURE });
  }
};
