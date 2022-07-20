import { GET_TEMPLATE_SUCCESS } from "../actions/download";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TEMPLATE_SUCCESS:
      return action.data;
    default:
      return state;
  }
};
