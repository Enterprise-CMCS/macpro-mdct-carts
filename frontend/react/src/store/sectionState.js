import axios from "axios";
/*
import thunk from "redux-thunk";
//ACTION TYPES
const SECTION = "SECTION";

//ACTION CREATORS
export const makeSection = (section) => ({
  type: SECTION,
  section: section
});

function updateState(action) {
  return {
    type: SECTION,
    section: action.section
  };
}
*/

/*
// SECTION REDUCER
function callApi() {
    const apiUrl = 'http://localhost:8000/structure/2020/1?format=json';
    return axios.get(apiUrl);
}




*/

const initialState = {
  section: {},
  money: 1000,
};

// ACTION TEST
const SOME_ACTION = "SOME_ACTION";

function createAction(data) {
  return {
    type: SOME_ACTION,
    payload: data,
  };
}

export const addMoney = (amount) => {
  return (dispatch) => {
    axios
      .get("http://localhost:8000/structure/2020/1?format=json")
      .then((res) => {
        dispatch(createAction(res.data.contents.section));
      });
  };
};

// SECTION REDUCER TEST
export const sectionState = (state = initialState, action) => {
  switch (action.type) {
    case SOME_ACTION:
      return {
        ...state,
        data: action.payload,
      };
      break;
    default:
      return state;
  }
};

//export {updateState};
//export default {reduceByAmount};
//export {reduceByAmount};
