// Storing global variables that will be the same regardless of users

const initialState = {
  formName: "CARTS FY",
  formYear: new Date().getFullYear().toString(),
  largeTextBoxHeight: 6,
  oktaEnabled: false,
};

// REDUCER
export default function (state = initialState) {
  return state;
}
