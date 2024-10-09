import requestOptions from "../hooks/authHooks/requestOptions";
import { apiLib } from "../util/apiLib";

export const GET_TEMPLATE = "GET_TEMPLATE";
export const GET_TEMPLATE_SUCCESS = "GET_TEMPLATE_SUCCESS";
export const GET_TEMPLATE_FAILURE = "GET_TEMPLATE_FAILURE";

export const getFiscalYearTemplate = (year) => async (dispatch) => {
  dispatch({ type: GET_TEMPLATE, data: "" });
  try {
    const opts = await requestOptions();
    const data = await apiLib.get(
      "carts-api",
      `/fiscalYearTemplate/${year}`,
      opts
    );

    dispatch({
      type: GET_TEMPLATE_SUCCESS,
      data: data.psurl,
    });
    window.location.href = data.psurl;
  } catch (e) {
    dispatch({ type: GET_TEMPLATE_FAILURE, data: "" });
  }
};
