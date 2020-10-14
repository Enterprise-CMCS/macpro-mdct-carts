import axios from "axios";
import forwardedQueryString from "./devQueryString";

const postDataToEndpointWithToken = (data, endpoint, token) => {
  const queryString = forwardedQueryString();
  const xhrURL = [window.env.API_POSTGRES_URL, endpoint, queryString].join("");
  const xhrHeaders = {
    Authorization: `Bearer ${token}`,
  };
  const returnData = async () =>
    axios({ method: "POST", url: xhrURL, headers: xhrHeaders, data });
  return returnData();
};

export default postDataToEndpointWithToken;
