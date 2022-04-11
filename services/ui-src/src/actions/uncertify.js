import axios from "../authenticatedAxios";

export const UNCERTIFY = "UNCERTIFY";
export const UNCERTIFY_SUCCESS = "UNCERTIFY_SUCCESS";
export const UNCERTIFY_FAILURE = "UNCERTIFY_FAILURE";

export const theUncertify =
  (stateCode, stateYear) => async (dispatch, getState) => {
    const state = getState();
    const user = state.stateUser.currentUser;
    const userName = `${user.firstname} ${user.lastname}`;

    // created a new record in carts_api_statestatus that will label the state as uncertified
    dispatch({ type: UNCERTIFY });
    try {
      const stateStatus = axios.post(`/state_status/`, {
        lastChanged: new Date(),
        state: stateCode,
        status: "in_progress",
        user_name: userName,
        year: stateYear,
      });

      const statusChangeEmail = axios.post(`/api/v1/sendemail/statuschange`, {
        subject: "CMS MDCT Carts",
        statecode: stateCode,
        source: window.location.hostname,
        status: "uncertify",
      });

      await axios
        .all([stateStatus, statusChangeEmail])
        .then(function (response) {
          window.alert(response.data.message.toString());
          window.location.reload(false);
        });

      dispatch({ type: UNCERTIFY_SUCCESS, stateCode: stateCode });
    } catch (e) {
      dispatch({ type: UNCERTIFY_FAILURE, message: { e } });
    }
  };
