import axios from "../authenticatedAxios";

export const UNCERTIFY = "UNCERTIFY";
export const UNCERTIFY_SUCCESS = "UNCERTIFY_SUCCESS";
export const UNCERTIFY_FAILURE = "UNCERTIFY_FAILURE";

export const theUncertify = (stateCode, stateYear) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const user = state.stateUser.currentUser;
  const userName = `${user.firstname} ${user.lastname}`;
  const recipients = `andrewadcock@gmail.com`;
  console.log("zzzzState", state);

  // created a new record in carts_api_statestatus that will label the state as uncertified
  dispatch({ type: UNCERTIFY });
  try {
    await axios.post(`/state_status/`, {
      last_changed: new Date(),
      state: stateCode,
      status: "in_progress",
      user_name: userName,
      year: stateYear,
    });
    dispatch({ type: UNCERTIFY_SUCCESS, stateCode: stateCode });
  } catch (e) {
    dispatch({ type: UNCERTIFY_FAILURE, message: { e } });
  }

  try {
    await axios
      .post(`/api/v1/sendemail/statuschange`, {
        subject: "CMS MDCT Carts",
        sender: "aadcock@collabralink.com",
        statecode: stateCode,
        source: window.location.hostname,
        status: "uncertify",
      })
      .then(function (response) {
        window.alert(response.data.message.toString());
        window.location.reload(false);
      });
  } catch (e) {
    window.alert("Update failed, please contact helpdesk for support");
  }
};
