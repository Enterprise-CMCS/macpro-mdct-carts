import { SET_STATE_STATUS, SET_STATE_STATUSES } from "../actions/initial";
import { CERTIFY_AND_SUBMIT_SUCCESS } from "../actions/certify";
import { UNCERTIFY_SUCCESS } from "../actions/uncertify";
import { REPORT_STATUS } from "../types";

const initialState = {
  status: null,
  lastChanged: null,
  username: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_STATUS:
      return {
        lastChanged: action.payload.lastChanged,
        status: action.payload.status,
        username: action.payload.username,
      };
    case SET_STATE_STATUSES:
      return action.payload;
    case CERTIFY_AND_SUBMIT_SUCCESS:
      return {
        ...state,
        [action.report]: {
          status: REPORT_STATUS.certified,
          lastChanged: new Date(),
          username: action.user,
        },
      };
    case UNCERTIFY_SUCCESS:
      return {
        ...state,
        [action.report]: {
          status: REPORT_STATUS.in_progress,
          lastChanged: new Date(),
          username: action.user,
        },
      };
    default:
      return state;
  }
};
