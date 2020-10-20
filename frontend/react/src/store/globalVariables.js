// Storing global variables that will be the same regardless of users

const initialState = {
  formName: "CARTS FY",
  formYear: new Date().getFullYear().toString(),
  largeTextBoxHeight: 6,
  isFetching: false
};

// REDUCER
export default function global (state = initialState, action) {
  if (action.type === 'CONTENT_FETCHING_STARTED') {
    return Object.assign({}, state, {
      isFetching: true
    })
  }

  if (action.type === 'CONTENT_FETCHING_FINISHED') {
    return Object.assign({}, state, {
      isFetching: false
    })
  }

  return state;
}
