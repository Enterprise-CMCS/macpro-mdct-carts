import Axios from "axios";
import forwardedQueryString from "./util/devQueryString";

const authenticatedAxios = Axios.create({
  baseURL: window.env.API_POSTGRES_URL,
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
});

export const setToken = (token) => {
  /* eslint-disable-line */
  console.log("csrf token added");
  authenticatedAxios.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.url += forwardedQueryString();

    /* eslint-disable-line */
    console.log("!+++++++++++++AXIOS CONFIG:", config);

    return config;
  });
};

export default authenticatedAxios;
