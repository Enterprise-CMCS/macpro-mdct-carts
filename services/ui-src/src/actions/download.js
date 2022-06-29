/* eslint-disable no-console */

/*
 * import { API } from "aws-amplify";
 * import requestOptions from "../hooks/authHooks/requestOptions";
 */

export const GET_TEMPLATE = "GET_TEMPLATE";
export const GET_TEMPLATE_SUCCESS = "GET_TEMPLATE_SUCCESS";
export const GET_TEMPLATE_FAILURE = "GET_TEMPLATE_FAILURE";

export const getFiscalYearTemplate = () => async (dispatch) => {
  try {
    /*
     * const opts = await requestOptions();
     * const data = await API.get("carts-api", `/state`, opts);
     */

    dispatch({
      type: GET_TEMPLATE_SUCCESS,
      data: "https://carts-download-master.s3.us-east-1.amazonaws.com/FFY_2021_CARTS_Template.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCUtTm4z8t2%2BDMnWcO1R4h5MuXYZFH5VwMlPp03LHIaDgIgK7gRjyU%2FBipwgDeGMX5TUKnjEUBx4XnZd6gwQYrT3Goq2AIIFxAAGgw1MTkwOTUzNjQ3MDgiDAcvCT74x%2FdKWhMxaSq1Aoa6WxF3zv2AmxFskn16dDykzzcz54nGLO3T7%2BK6M2t%2FdTdQxjM9%2Bp1w4Ciq8ERr83LJ4ohvvnmNfc1FmxsWBGII3ZG7nY%2Fn98xUXDXmpKk%2Bhk%2BpEbgZDJ%2Fk3DLUT%2FEm5nbSLbX%2FqDThv7I3aFMBIi6XxERxXxy7eCQi6VesXum1J27xFtTyP%2FKYOm7fXoXuZRy9Ekz976UpvXHPtET2tvaBoqkNls%2F44ICq%2F7NGNxA6%2B%2Btm8%2BEh042V2ifdhor9K92ikC1CWgP%2FWo7ONI90%2FFTGd3DbQWrHIWE2qq4G2DGmN0Hnz0VhrWHCe3SqKT%2B7vcy2KL2tHi5jy7cvg0DiuFbmG9DVl09VvLp1sNOw1B%2B75F8vKlGIpkPKoe9lcl%2BWJHLCwnFpgSScqraVNtcIA5xLnvyr6DDJtPGVBjqHAh1TVM9QmDWsLxaqaEWCwaXMPyT%2F61Gkqc9enNcUaUtBSk%2B814kKfty5N43n%2FVr%2BPO0id8mNpUKjKvjd0nZHH37GE%2BeseC%2FL87DSEsR4NJdwBXjMSlCOMh7VPmQK6fItc6%2Fpvnu0rbiCZJ5XFi7SvBsLNHCHPdDhVKCJCrdmCj7mTFnbaGB3CzdSm%2BM0CBXh2L0WnllFlDURkDhLjrzaYXBXpY4bTzU5AMw3Bdiw8owrlqCnJxzTzNgJ8boTIM8wNMm3d95xdAffgD8Ypu77%2FAXlNUW%2FTcJz9y2UIIr9X%2FoVVOaDXjprFtYx6CyKhTOwA5yD4EEGfdXvvqV6CRSV12x6Z0LiquwI&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220629T165101Z&X-Amz-SignedHeaders=host&X-Amz-Expires=7200&X-Amz-Credential=ASIAXRXD6VRSHMR47XZW%2F20220629%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a61948171a8a7586d1f6bf13a6eb01453950d5910d1c4d9e36ff1d16799ee214",
    });
  } catch (e) {
    dispatch({ type: GET_TEMPLATE_FAILURE });
  }
};
