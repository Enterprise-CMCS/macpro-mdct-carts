import {
  del as ampDel,
  get as ampGet,
  post as ampPost,
  put as ampPut,
} from "aws-amplify/api";
import {
  fetchAuthSession,
  signIn,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import { updateTimeout } from "../hooks/authHooks";

export async function getRequestHeaders() {
  try {
    const tokens = await getTokens();
    const headers = {
      "x-api-key": tokens?.idToken?.toString(),
    };

    return headers;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getTokens() {
  return (await fetchAuthSession()).tokens;
}

export async function authenticateWithIDM() {
  await signInWithRedirect({ provider: { custom: "Okta" } });
}

export async function loginUser(username, password) {
  await signIn({ username, password });
}

export async function logoutUser() {
  await signOut();
}

export async function refreshSession() {
  await fetchAuthSession({ forceRefresh: true }); // force a token refresh
}

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiRequest = async (request, path, opts, hasResponseBody) => {
  try {
    const requestHeaders = await getRequestHeaders();
    const options = {
      headers: { ...requestHeaders },
      ...opts,
    };
    await updateTimeout();
    const { body, statusCode } = await request({
      apiName: "carts-api",
      path,
      options,
    }).response;
    if (hasResponseBody === false || statusCode === 204) {
      return undefined;
    }
    const res = await body.text(); // body.json() dies on an empty response, spectacularly
    return res && res.length > 0 ? JSON.parse(res) : null;
  } catch (e) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  post: async (path, opts) => await apiRequest(ampPost, path, opts),
  put: async (path, opts) => await apiRequest(ampPut, path, opts),
  get: async (path, opts) => await apiRequest(ampGet, path, opts),
  del: async (path, opts) => await apiRequest(ampDel, path, opts, false),
};
