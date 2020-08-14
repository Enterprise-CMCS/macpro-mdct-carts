// Mostly taken from https://redux.js.org/advanced/async-actions
const initialState = {
  selectedSection: '1',
  dataBySection: {
    section1: {
      isFetching: false,
      items: []
    }
  }
};

const SELECT_SECTION = "SELECT_SECTION";
const REQUEST_SECTION_DATA = "REQUEST_SECTION_DATA";
const RECEIVE_SECTION_DATA = "RECEIVE_SECTION_DATA";

export const selectSection = (section) => {
  return {
    type: SELECT_SECTION,
    section
  }
}

export const selectedSection = (state = '0', action) => {
  switch (action.type) {
    case SELECT_SECTION:
      return action.section
    default:
      return state
  }
}

const requestSectionData = (section) => {
  return {
    type: REQUEST_SECTION_DATA,
    section
  }
}

const receiveSectionData = (section, json) => {
  return {
    type: RECEIVE_SECTION_DATA,
    section,
    data: json.contents.section
  }
}

const sectionData = (
  state = {
    isFetching: false,
    items: []
  },
  action
) => {
  switch (action.type) {
    case REQUEST_SECTION_DATA:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_SECTION_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.data
      })
    default:
      return state
  }
}

export const dataBySection = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_SECTION_DATA:
    case REQUEST_SECTION_DATA:
      return Object.assign({}, state, {
        [`section${action.section}`]: sectionData(state[action.section], action)
      })
    default:
      return state
  }
}

export const fetchSectionData = (section) => {
  return function (dispatch) {
    dispatch(requestSectionData(section));
    return fetch(`http://localhost:8000/structure/2020/${section}?format=json`)
      .then(response => response.json())
      .then(json => dispatch(receiveSectionData(section, json)));
  }
}