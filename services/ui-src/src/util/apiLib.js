/* eslint-disable no-console */
import { API, Auth } from "aws-amplify";
import config from "../config";
import { updateTimeout } from "../hooks/authHooks";

export async function getRequestHeaders() {
  try {
    const token = await getTokens();
    const idToken = await token.getJwtToken();
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
  return await session.getIdToken();
}

export async function authenticateWithIDM() {
  const authConfig = Auth.configure();
  if (authConfig?.oauth) {
    const oAuthOpts = authConfig.oauth;
    const domain = oAuthOpts.domain;
    const responseType = oAuthOpts.responseType;
    const redirectSignIn = oAuthOpts.redirectSignIn;
    const clientId = authConfig.userPoolWebClientId;
    const url = `https://${domain}/oauth2/authorize?identity_provider=Okta&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${clientId}`;
    window.location.assign(url);
  }
  const cognitoHostedUrl = new URL(
    `https://${config.cognito.APP_CLIENT_DOMAIN}/oauth2/authorize?identity_provider=${config.cognito.COGNITO_IDP_NAME}&redirect_uri=${config.APPLICATION_ENDPOINT}&response_type=CODE&client_id=${config.cognito.APP_CLIENT_ID}&scope=email openid profile`
  );
  window.location.replace(cognitoHostedUrl);
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
    await updateTimeout();
    return API[request]("carts-api", path, options);
  } catch (e) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  post: async (path, options) => apiRequest("post", path, options),
  put: async (path, options) => apiRequest("put", path, options),
  get: async (path, options) => apiRequest("get", path, options),
  del: async (path, options) => apiRequest("del", path, options),
};
