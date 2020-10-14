import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import * as qs from "query-string"; // eslint-disable-line import/no-extraneous-dependencies
import Routes from "./reactRouter";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Userinfo from "./components/sections/Userinfo";
import InitialDataLoad from "./components/Utils/InitialDataLoad";
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
  if (loc.dev && Object.keys(devKeys).includes(loc.dev)) {
    const userData = { userToken: loc.dev };

    return (
      <div className="App" data-test="component-app">
        <InitialDataLoad userData={userData} />
        {VisibleHeader}
        <Routes />
        {VisibleFooter}
      </div>
    );
  }
  return (
    <div className="App" data-test="component-app">
      <Security
        {...config.oidc}
        tokenManager={{ secure: true, storage: "cookie" }}
      >
        {VisibleHeader}
        <Router>
          <div className="ds-l-container">
            <div className="ds-l-row">
              <SecureInitialDataLoad />
              <SecureRoute path="/" />
              <Sidebar />
              <SaveError />
              <ScrollToTop />
              <Route path={config.callback} component={LoginCallback} />
              <SecureRoute path="/profile" component={Profile} />
              <Switch>
                <SecureRoute
                  exact
                  path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
                >
                  <InvokeSection />
                </SecureRoute>
                <SecureRoute path="/views/sections/:state/:year/:sectionOrdinal">
                  <InvokeSection />
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
      </Security>
    </div>
  );
};

export default WrappedSecurity;
