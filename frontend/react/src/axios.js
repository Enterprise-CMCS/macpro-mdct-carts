import Axios from "axios";
import forwardedQueryString from "./util/devQueryString";

const axios = Axios.create({
  baseURL: window.env.API_POSTGRES_URL,
});

export const setToken = (token) => {
  axios.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.url += forwardedQueryString();
    return config;
  });
};

export default axios;
