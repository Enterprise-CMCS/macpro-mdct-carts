/* eslint-disable no-console */

import { get, put, post, del } from "aws-amplify/api";
import { updateTimeout } from "../hooks/authHooks";

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiRequest = async (request, path, options) => {
  try {
    // swallow request error codes for aws lib, they'll kill the lib
    await updateTimeout();
    const response = await request({ apiName: "carts-api", path, options })
      .response;
    const body = await response?.body?.text(); // body.json() dies on an empty response, spectacularly
    return body && body.length > 0 ? JSON.parse(body) : null;
  } catch (e) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  post: async (path, options) => apiRequest(post, path, options),
  put: async (path, options) => apiRequest(put, path, options),
  get: async (path, options) => apiRequest(get, path, options),
  del: async (path, options) => apiRequest(del, path, options),
};
