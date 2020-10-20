import { SET_STATE_STATUS, SET_STATE_STATUSES } from "../actions/initial";
import { CERTIFY_AND_SUBMIT_SUCCESS } from "../actions/certify";

const initialState = {
  status: null,
  lastChanged: null,
  userName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_STATUS:
      return {
        lastChanged: action.payload.last_changed,
        status: action.payload.status,
        userName: action.payload.user_name,
      };
    case SET_STATE_STATUSES:
      return action.payload;
    case CERTIFY_AND_SUBMIT_SUCCESS:
      return {
        ...state,
        status: "certified",
        userName: action.user,
      };
    default:
      return state;
  }
};
