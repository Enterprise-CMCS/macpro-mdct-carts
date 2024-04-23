/* eslint-disable no-console */

import { get, put, post, del } from "aws-amplify/api";
import { updateTimeout } from "../hooks/authHooks";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiRequest = async (request, apiName, path, options) => {
  updateTimeout();
  const response = await request({ apiName, path, options }).response;
  const body = await response?.body?.text(); // body.json() dies on an empty response, spectacularly
  return body && body.length > 0 ? JSON.parse(body) : null;
};

export const apiLib = {
  post: async (apiName, path, options) =>
    apiRequest(post, apiName, path, options),
  put: async (apiName, path, options) =>
    apiRequest(put, apiName, path, options),
  get: async (apiName, path, options) =>
    apiRequest(get, apiName, path, options),
  del: async (apiName, path, options) =>
    apiRequest(del, apiName, path, options),
};
