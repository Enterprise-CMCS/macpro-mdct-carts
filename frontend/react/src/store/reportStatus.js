import { SET_STATE_STATUS } from "../actions/initial";
import { CERTIFY_AND_SUBMIT_SUCCESS } from "../actions/certify";

const initialState = {
  id: null,
  status: null,
  lastChanged: null,
  userName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_STATUS:
      return {
        id: action.payload.id,
        lastChanged: action.payload.last_changed,
        status: action.payload.status,
        userName: action.payload.user_name,
      };
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
