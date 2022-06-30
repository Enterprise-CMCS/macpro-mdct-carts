/* eslint-disable no-console */
import { API } from "aws-amplify";
import requestOptions from "../hooks/authHooks/requestOptions";

export const GET_TEMPLATE = "GET_TEMPLATE";
export const GET_TEMPLATE_SUCCESS = "GET_TEMPLATE_SUCCESS";
export const GET_TEMPLATE_FAILURE = "GET_TEMPLATE_FAILURE";

export const getFiscalYearTemplate = () => async (dispatch) => {
  try {
    const opts = await requestOptions();
    const data = await API.get(
      "carts-api",
      `/downloads/fiscalYearTemplate`,
      opts
    );

    dispatch({
      type: GET_TEMPLATE_SUCCESS,
      data,
    });
  } catch (e) {
    dispatch({ type: GET_TEMPLATE_FAILURE, data: "" });
  }
};
