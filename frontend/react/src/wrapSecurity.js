import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import {
  Security,
  SecureRoute as OktaSecureRoute,
  LoginCallback,
} from "@okta/okta-react";
import * as qs from "query-string";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Userinfo from "./components/sections/Userinfo";
import InvokeSection from "./components/Utils/InvokeSection";
import SecureInitialDataLoad from "./components/Utils/SecureInitialDataLoad";
import Sidebar from "./components/layout/Sidebar";
import ScrollToTop from "./components/Utils/ScrollToTop";
import StateAssociations from "./components/Utils/StateAssociations";
import UserRoleAssociations from "./components/Utils/UserRoleAssociations";
import JobCodeRoleAssociations from "./components/Utils/JobCodeRoleAssociations";
import SaveError from "./components/layout/SaveError";
import Profile from "./Profile";
import config from "./auth-config";
import CertifyAndSubmit from "./components/layout/CertifyAndSubmit";
import Homepage from "./components/sections/homepage/Homepage";

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

  return (
    <div className="App" data-test="component-app">
      <SecurityWrapper
        {...config.oidc}
        tokenManager={{ secure: true, storage: "cookie" }}
      >
        {VisibleHeader}
        <Router>
          <div className="ds-l-container">
            <div className="ds-l-row">
              <SecureInitialDataLoad
                stateCode={stateCode}
                userData={userData}
              />
              <SecureRoute path="/" />
              <SaveError />
              <ScrollToTop />
              <Route path={config.callback} component={LoginCallback} />
              <SecureRoute path="/profile" component={Profile} />
              <Switch>
                <SecureRoute exact path="/">
                  <Homepage />
                </SecureRoute>

                <SecureRoute
                  exact
                  path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
                >
                  <Sidebar />
                  <InvokeSection />
                </SecureRoute>
                <SecureRoute path="/views/sections/:state/:year/:sectionOrdinal">
                  <Sidebar />
                  <InvokeSection />
                </SecureRoute>

                <SecureRoute path="/sections/:year/:sectionOrdinal/:subsectionMarker">
                  <Sidebar />
                  <InvokeSection userData={userData} />
                </SecureRoute>
                <SecureRoute path="/sections/:year/:sectionOrdinal">
                  <Sidebar />
                  <InvokeSection userData={userData} />
                </SecureRoute>
                <SecureRoute path="/sections/certify-and-submit">
                  <Sidebar />
                  <CertifyAndSubmit />
                </SecureRoute>
              </Switch>
              <SecureRoute exact path="/userinfo" component={Userinfo} />
              <SecureRoute
                exact
                path="/state_assoc"
                component={StateAssociations}
              />
              <SecureRoute
                exact
                path="/role_user_assoc"
                component={UserRoleAssociations}
              />
              <SecureRoute
                exact
                path="/role_jobcode_assoc"
                component={JobCodeRoleAssociations}
              />
            </div>
          </div>
        </Router>
        {VisibleFooter}
      </SecurityWrapper>
    </div>
  );
};

export default WrappedSecurity;
