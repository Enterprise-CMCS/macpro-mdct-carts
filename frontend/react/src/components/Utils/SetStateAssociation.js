import axios from "axios";
import forwardedQueryString from "../../util/devQueryString";

const setStateAssociations = (data, token) => {
  const queryString = forwardedQueryString();
  const xhrURL = [
    window.env.API_POSTGRES_URL,
    "/state_assoc/",
    queryString,
  ].join("");
  const xhrHeaders = {
    Authorization: `Bearer ${token}`,
  };
  const returnData = async () =>
    axios({ method: "POST", url: xhrURL, headers: xhrHeaders, data });
  return returnData();
};

export default setStateAssociations;
