// import axios from "axios";

// Importing in static data, will be removed when we have endpoints
import Data from "../components/sections/section3Fapi/backend-json-section-3.json";
const section3FData = Data.section.subsections[5];

//ACTION TYPES
const GOT_SECTION_3F = "GET_SECTION_3F";
const UPDATED_SECTION_3F = "UPDATE_SECTION_3F";

const initialState = {
  // This is the JSON data we need to map through to render dynamic form
  questionData: {
    section3AData: "some placeholder",
    section3BData: "some placeholder",
    section3CData: "some placeholder",
    section3DData: "some placeholder",
    section3EData: "some placeholder",
    section3FData: section3FData,
  },
  // This is the current input of the user as they move through the form
  currentUserInput: {
    subsection3FInput: {
      "2020-03-f-01-01": "yes",
      "2020-03-f-01-02": "no",
      "2020-03-f-01-03": "yes",
    },
  },
};

//ACTION CREATORS
export const gotSubsectionData = (dataObject) => ({
  type: GOT_SECTION_3F,
  dataObject,
});

export const updatedSubsectionData = (dataObject) => ({
  type: UPDATED_SECTION_3F,
  dataObject,
});

// THUNK, **placeholders!** An example of fetching the question data for a section
// export const getSubsectionData = (sectionID) => async (dispatch) => {
//   try {
//     const { data } = await axios.get(`/api/some/endpoint/${sectionID}`);
//     dispatch(gotSubsectionData(data));
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const updateSubsectionData = (
//   sectionID,
//   questionID,
//   questionAnswer
// ) => async (dispatch) => {
//   try {
//     const { data } = await axios.post(`/api/some/endpoint/${sectionID}`, {
//       questionID,
//       questionAnswer,
//     });

//     dispatch(updatedSubsectionData(data));
//   } catch (err) {
//     console.log(err);
//   }
// };

// STATE USER REDUCER
export default function (state = initialState, action) {
  switch (action.type) {
    case GOT_SECTION_3F:
      return {
        ...state,
        questionData: {
          ...state.questionData,
          section3FData: action.dataObject,
        },
      };
    case UPDATED_SECTION_3F:
      return {
        ...state,
        currentUserInput: {
          ...state.currentUserInput,
          subsection3FInput: action.dataObject,
        },
      };

    default:
      return state;
  }
}
