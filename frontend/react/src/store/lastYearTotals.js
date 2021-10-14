const initialState = {
  calculatedTotal: false,
};
export const SET_LAST_YEAR_TOTALS = "SET_LAST_YEAR_TOTALS";
export const ADD_TO_TOTAL = "ADD_TO_TOTAL";
export const FINISH_CALCULATION = "FINISH_CALCULATION";

export const lastYearTotals = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAST_YEAR_TOTALS:
      return {
        ...state,
        ...action.data,
      };

    case ADD_TO_TOTAL:
      if (state.calculatedTotal) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        [action.payload.id]: state[action.payload.id]
          ? action.payload.newValue + state[action.payload.id]
          : action.payload.newValue,
      };
    case FINISH_CALCULATION:
      return {
        ...state,
        calculatedTotal: true,
      };
    default:
      return state;
  }
};
