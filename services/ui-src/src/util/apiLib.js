/* eslint-disable no-console */
import { API, Auth } from "aws-amplify";
import { updateTimeout } from "../hooks/authHooks";

export async function getRequestHeaders() {
  try {
    const idToken = await getTokens();
    const headers = {
      "x-api-key": idToken,
    };
    return headers;
  } catch (e) {
    console.log({ e }); // eslint-disable-line no-console
  }
}

export async function getTokens() {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
}

export async function authenticateWithIDM() {
  Auth.federatedSignIn({ customProvider: "Okta" });
}

export async function loginUser(username, password) {
  await Auth.signIn(username, password);
}

export async function logoutUser() {
  await Auth.signOut();
}

export async function refreshSession() {
  await Auth.currentAuthenticatedUser({ bypassCache: true }); // Force a token refresh
}

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 */
const apiRequest = async (request, path, opts) => {
  try {
    const requestHeaders = await getRequestHeaders();
    const options = {
      headers: { ...requestHeaders },
      ...opts,
    };
    // swallow request error codes for aws lib, they'll kill the lib
    await updateTimeout();
    return await request({ apiName: "carts-api", path, options });
  } catch (e) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  post: async (path, options) => apiRequest(API.post, path, options),
  put: async (path, options) => apiRequest(API.put, path, options),
  get: async (path, options) => apiRequest(API.get, path, options),
  del: async (path, options) => apiRequest(API.del, path, options),
};
