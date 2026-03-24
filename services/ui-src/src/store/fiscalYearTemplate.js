const initialState = [];

// oxlint-disable-next-line no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_TEMPLATE_SUCCESS":
      return action.data;
    default:
      return state;
  }
};
