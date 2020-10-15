import axios from "../authenticatedAxios";

const postDataToEndpointWithToken = (data, endpoint) => {
  const xhrURL = [window.env.API_POSTGRES_URL, endpoint].join("");
  return axios.post(xhrURL, data);
};

export default postDataToEndpointWithToken;
