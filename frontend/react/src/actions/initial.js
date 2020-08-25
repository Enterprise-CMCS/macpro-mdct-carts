import axios from "axios";

export const LOAD_SECTIONS = "LOAD SECTIONS";

export const loadSections = () => {
  return async dispatch => {
    const { data } = await axios.get("//localhost:8000/api/v1/sections/2020/AK");
    dispatch({ type: LOAD_SECTIONS, data });
  };
};
