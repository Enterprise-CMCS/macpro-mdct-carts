import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/storeIndex";
import BrowserIssue from "./components/layout/BrowserIssue";
import App from "./App";
import Amplify from "aws-amplify";
import config from "./config";

// Internet Explorer
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge
const isEdge = !isIE && !!window.StyleMedia;

Amplify.configure({
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "carts-api",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
      {
        name: "prince",
        endpoint:
          "https://y5pywiyrb7.execute-api.us-east-1.amazonaws.com/master/prince",
        region: config.apiGateway.REGION,
      },
    ],
  },
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    oauth: {
      domain: config.cognito.APP_CLIENT_DOMAIN,
      redirectSignIn: config.cognito.REDIRECT_SIGNIN,
      redirectSignOut: config.cognito.REDIRECT_SIGNOUT,
      scope: ["email", "openid", "profile", "aws.cognito.signin.user.admin"],
      responseType: "token",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {isIE || isEdge ? <BrowserIssue /> : <App />}
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
