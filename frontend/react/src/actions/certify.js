import axios from "../axios";

export const CERTIFY_AND_SUBMIT = "CERTIFY_AND_SUBMIT";
export const CERTIFY_AND_SUBMIT_SUCCESS = "CERTIFY_AND_SUBMIT_SUCCESS";
export const CERTIFY_AND_SUBMIT_FAILURE = "CERTIFY_AND_SUBMIT_FAILURE";

export const certifyAndSubmit = () => async (dispatch, getState) => {
  const reportId = getState().reportStatus.id;
  if (reportId) {
    dispatch({ type: CERTIFY_AND_SUBMIT });
    try {
      await axios.patch(`/state_status/${reportId}/`, {
        last_changed: new Date(),
        status: "certified",
      });
      dispatch({ type: CERTIFY_AND_SUBMIT_SUCCESS });
    } catch (e) {
      dispatch({ type: CERTIFY_AND_SUBMIT_FAILURE });
    }
  }
};
