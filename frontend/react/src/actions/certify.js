import axios from "../authenticatedAxios";

export const CERTIFY_AND_SUBMIT = "CERTIFY_AND_SUBMIT";
export const CERTIFY_AND_SUBMIT_SUCCESS = "CERTIFY_AND_SUBMIT_SUCCESS";
export const CERTIFY_AND_SUBMIT_FAILURE = "CERTIFY_AND_SUBMIT_FAILURE";

export const certifyAndSubmit = () => async (dispatch, getState) => {
  const state = getState();
  const user = state.stateUser.currentUser;

  const stateCode = state.stateUser.abbr;
  const userName = `${user.firstname} ${user.lastname}`;
  const year = +state.global.formYear;

  dispatch({ type: CERTIFY_AND_SUBMIT });
  try {
    // TODO: Remove ?dev=dev-admin after local testing before merging to DEV
    const stateStatus = axios.post(`/state_status?dev=dev-ak`, {
      last_changed: new Date(),
      state: stateCode,
      status: "certified",
      user_name: userName,
      year,
    });

    const statusChangeEmail = axios
      .post(`/api/v1/sendemail/statuschange`, {
        subject: "CMS MDCT Carts",
        statecode: stateCode,
        source: window.location.hostname,
        status: "certify",
      })
      .then(function (response) {
        window.alert(response.data.message.toString());
        window.location.reload(false);
      });

    await axios.all([stateStatus, statusChangeEmail]).then(function (response) {
      window.alert(response.data.message.toString());
      window.location.reload(false);
    });
    dispatch({ type: CERTIFY_AND_SUBMIT_SUCCESS, user: userName });
  } catch (e) {
    dispatch({ type: CERTIFY_AND_SUBMIT_FAILURE });
  }
};
