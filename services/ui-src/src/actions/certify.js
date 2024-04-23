import requestOptions from "../hooks/authHooks/requestOptions";
import { REPORT_STATUS } from "../types";
import { apiLib } from "../util/apiLib";

export const CERTIFY_AND_SUBMIT = "CERTIFY_AND_SUBMIT";
export const CERTIFY_AND_SUBMIT_SUCCESS = "CERTIFY_AND_SUBMIT_SUCCESS";
export const CERTIFY_AND_SUBMIT_FAILURE = "CERTIFY_AND_SUBMIT_FAILURE";

/**
 * Updates the state status for the current report to "certified"
 */
export const certifyAndSubmit = () => async (dispatch, getState) => {
  const stateObject = getState();
  const user = stateObject.stateUser.currentUser;
  const username = `${user.firstname} ${user.lastname}`;
  const state = stateObject.stateUser.abbr;
  const year = stateObject.global.formYear;

  dispatch({ type: CERTIFY_AND_SUBMIT });

  try {
    const opts = await requestOptions();
    opts.body = {
      status: REPORT_STATUS.certified,
      username: username,
    };

    await apiLib.post("carts-api", `/state_status/${year}/${state}`, opts);
    dispatch({
      type: CERTIFY_AND_SUBMIT_SUCCESS,
      user: username,
      report: `${state}${year}`,
    });
  } catch (e) {
    alert("ERROR_[CERTIFY]: Contact Help Desk. " + e.toString());
    window.location.reload(false);
    dispatch({ type: CERTIFY_AND_SUBMIT_FAILURE });
  }
};
