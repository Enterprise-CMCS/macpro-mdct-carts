import React from "react";
import "font-awesome/css/font-awesome.min.css";
import { useDispatch } from "react-redux";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  Security,
  SecureRoute as OktaSecureRoute,
  LoginCallback,
} from "@okta/okta-react";
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
import LocalAuthenticatedRoute from "./components/Utils/LocalAuthenticatedRoute";
import { loadUser } from "./actions/initial";

const WrappedSecurity = () => {
  const dispatch = useDispatch();
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

  let userData = false;
  let stateCode = false;
  const loginInfo = localStorage.getItem("loginInfo") || "";
  const isLocalOkta = loginInfo === "local-okta";
  const localUserPrefix = "localLoggedin-";
  let localLogin =
    !window.location.origin.includes("mdctcartsdev.cms") && !isLocalOkta;
  if (
    localLogin &&
    loginInfo.indexOf(localUserPrefix) >= 0 &&
    loginInfo.length > localUserPrefix.length
  ) {
    const userName = loginInfo.replace(localUserPrefix, "");
    dispatch(loadUser(userName));
  }

  // If we're using Okta, wrap everything in Okta's Security component and use
  // its SecureRoutes. Otherwise, use plain Routes and wrap everything in a div.
  const SecurityWrapper = !localLogin ? Security : "div";
  const SecureRoute = !localLogin ? OktaSecureRoute : LocalAuthenticatedRoute;

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
          {!localLogin ? (
            <>
              <SecureInitialDataLoad stateCode={stateCode} />
              <Route path={config.callback} component={LoginCallback} />
            </>
          ) : null}
          <Home SecureRouteComponent={SecureRoute} localLogin={localLogin} />
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
