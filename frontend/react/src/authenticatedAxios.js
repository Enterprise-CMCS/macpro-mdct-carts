import Axios from "axios";

const authenticatedAxios = Axios.create({
  baseURL: window.env.API_POSTGRES_URL,
  // *** xsrf header / cookie needed by django
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
});

export const setToken = (token) => {
  authenticatedAxios["interceptors"].request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default authenticatedAxios;
