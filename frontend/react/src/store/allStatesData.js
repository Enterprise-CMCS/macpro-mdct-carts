import { GET_ALL_STATES_DATA } from "../actions/initial";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_STATES_DATA:
      return action.data;
    default:
      return state;
  }
};
