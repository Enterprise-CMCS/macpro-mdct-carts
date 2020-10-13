import { SET_STATE_STATUS } from "../actions/initial";
import { certifyAndSubmit } from "../actions/certify";

const initialState = {
  id: null,
  status: null,
  lastChanged: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_STATUS:
      return {
        id: action.payload.id,
        lastChanged: action.payload.last_changed,
        status: action.payload.status,
      };
    case certifyAndSubmit.success:
      return {
        ...state,
        status: "certified",
      };
    default:
      return state;
  }
};
