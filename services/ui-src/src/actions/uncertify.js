import requestOptions from "../hooks/authHooks/requestOptions";
import { REPORT_STATUS } from "../types";
import { apiLib } from "../util/apiLib";

export const UNCERTIFY = "UNCERTIFY";
export const UNCERTIFY_SUCCESS = "UNCERTIFY_SUCCESS";
export const UNCERTIFY_FAILURE = "UNCERTIFY_FAILURE";

export const theUncertify =
  (stateCode, reportYear) => async (dispatch, getState) => {
    const stateObject = getState();
    const user = stateObject.stateUser.currentUser;
    const username = `${user.firstname} ${user.lastname}`;
    const state = stateCode;
    const year = reportYear;

    dispatch({ type: UNCERTIFY });
    try {
      const opts = await requestOptions();
      opts.body = {
        status: REPORT_STATUS.in_progress,
        username: username,
        year: reportYear,
        state: state,
      };

      await apiLib.post("carts-api", `/state_status/${year}/${state}`, opts);
      dispatch({
        type: UNCERTIFY_SUCCESS,
        user: username,
        report: `${state}${year}`,
      });
    } catch (e) {
      dispatch({ type: UNCERTIFY_FAILURE, message: { e } });
    }
  };
