import { API } from "aws-amplify";
import { updateTimeout } from "../hooks/authHooks";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const post = async (api, uri, opts) => {
  updateTimeout();
  return await API.post(api, uri, opts);
};
const get = async (api, uri, opts) => {
  updateTimeout();
  return await API.get(api, uri, opts);
};
const del = async () => async (api, uri, opts) => {
  updateTimeout();
  return await API.del(api, uri, opts);
};

export const apiLib = {
  get,
  post,
  del,
};
