import { API } from "aws-amplify";
import requestOptions from "../hooks/authHooks/requestOptions";
import { REPORT_STATUS } from "../types";

export const CERTIFY_AND_SUBMIT = "CERTIFY_AND_SUBMIT";
export const CERTIFY_AND_SUBMIT_SUCCESS = "CERTIFY_AND_SUBMIT_SUCCESS";
export const CERTIFY_AND_SUBMIT_FAILURE = "CERTIFY_AND_SUBMIT_FAILURE";

/**
 * Updates the state status for the current report to "certified"
 */
export const certifyAndSubmit = () => async (dispatch, getState) => {
  const stateObject = getState();
  const { username } = stateObject.stateUser.currentUser;
  const state = stateObject.stateUser.abbr;
  const year = +stateObject.global.formYear;

  dispatch({ type: CERTIFY_AND_SUBMIT });
  try {
    const opts = await requestOptions();
    opts.body = {
      status: REPORT_STATUS.certified,
      username: username,
    };

    await API.post("carts-api", `/state_status/${year}/${state}`, opts);

    dispatch({ type: CERTIFY_AND_SUBMIT_SUCCESS, user: username });
  } catch (e) {
    console.log(e)
    //alert("ERROR_[CERTIFY]: Contact Help Desk. " + e.toString());
    //window.location.reload(false);
    dispatch({ type: CERTIFY_AND_SUBMIT_FAILURE });
  }
};
