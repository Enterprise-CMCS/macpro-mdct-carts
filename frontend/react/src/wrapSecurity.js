import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import {
  Security,
  SecureRoute as OktaSecureRoute,
  LoginCallback,
} from "@okta/okta-react";
import * as qs from "query-string";
import Header from "./components/layout/Header";
import Home from "./components/layout/Home";
import Footer from "./components/layout/Footer";
import Userinfo from "./components/sections/Userinfo";
import UserProfile from "./components/sections/UserProfile";
import Print from "./components/sections/Print";
import SecureInitialDataLoad from "./components/Utils/SecureInitialDataLoad";
import Profile from "./Profile";
import config from "./auth-config";
import Spinner from "./components/Utils/Spinner";

const WrappedSecurity = () => {
  const VisibleHeader =
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? null : (
      <Header />
    );

  const VisibleFooter =
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? null : (
      <Footer />
    );

  const loc = qs.parse(useLocation().search);
  const devKeys = {
    "dev-ak": "AK",
    "dev-az": "AZ",
    "dev-ma": "MA",
    "dev-admin": "admin_user",
    "dev-co_user": "co_user",
  };
  let userData = false;
  let stateCode = false;
  if (loc.dev && Object.keys(devKeys).includes(loc.dev)) {
    // We're going to bypass Okta.
    userData = { userToken: loc.dev };
    stateCode = devKeys[loc.dev];
  }

  // If we're using Okta, wrap everything in Okta's Security component and use
  // its SecureRoutes. Otherwise, use plain Routes and wrap everything in a div.
  const SecurityWrapper = userData === false ? Security : "div";
  const SecureRoute = userData === false ? OktaSecureRoute : Route;

  /* eslint-disable-line */
  console.log("!***** initial data load [userData] ===>", userData);

  return (
    <div
      className={"App " + window.location.pathname.split("/")[1]}
      data-test="component-app"
    >
      <SecurityWrapper
        {...config.oidc}
        tokenManager={{ secure: true, storage: "cookie" }}
      >
        {VisibleHeader}
        <Spinner />
        <Router>
          <SecureInitialDataLoad stateCode={stateCode} userData={userData} />
          <Route path={config.callback} component={LoginCallback} />
          <Home SecureRouteComponent={SecureRoute} />

          {/* These routes are available to everyone, so define them here */}
          <SecureRoute exact path="/userinfo" component={Userinfo} />
          <SecureRoute path="/profile" component={Profile} />
          <SecureRoute path="/user/profile" component={UserProfile} />
          <SecureRoute path="/print" component={Print} />
        </Router>
        {VisibleFooter}
      </SecurityWrapper>
    </div>
  );
};

export default WrappedSecurity;
