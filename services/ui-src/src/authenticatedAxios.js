import Axios from "axios";

const authenticatedAxios = Axios.create({
  baseURL: window.env.API_POSTGRES_URL,
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
});

export const setToken = (token, localUserType = false) => {
  authenticatedAxios.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (localUserType) {
      config.url += "?dev=" + localUserType;
    }

    return config;
  });
};

export default authenticatedAxios;
