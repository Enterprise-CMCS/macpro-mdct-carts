import { get, put, post, del } from "aws-amplify/api";
import { updateTimeout } from "../hooks/authHooks";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiPost = (api, uri, opts) => {
  updateTimeout();
  return post(api, uri, opts);
};
const apiPut = (api, uri, opts) => {
  updateTimeout();
  return put(api, uri, opts);
};
const apiGet = (api, uri, opts) => {
  updateTimeout();
  return get(api, uri, opts);
};
const apiDel = (api, uri, opts) => {
  updateTimeout();
  return del(api, uri, opts);
};

export const apiLib = {
  post: apiPost,
  put: apiPut,
  get: apiGet,
  del: apiDel,
};
