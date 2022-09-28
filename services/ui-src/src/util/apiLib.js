import { API } from "aws-amplify";
import { updateTimeout } from "../hooks/authHooks";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const post = (api, uri, opts) => {
  updateTimeout();
  return API.post(api, uri, opts);
};
const put = (api, uri, opts) => {
  updateTimeout();
  return API.put(api, uri, opts);
};
const get = (api, uri, opts) => {
  updateTimeout();
  return API.get(api, uri, opts);
};
const del = (api, uri, opts) => {
  updateTimeout();
  return API.del(api, uri, opts);
};

export const apiLib = {
  get,
  post,
  put,
  del,
};
