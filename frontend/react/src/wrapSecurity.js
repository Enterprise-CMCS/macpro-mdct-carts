import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import * as qs from "query-string"; // eslint-disable-line import/no-extraneous-dependencies
import Routes from "./reactRouter";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import InitialDataLoad from "./components/Utils/InitialDataLoad";
import SecureInitialDataLoad from "./components/Utils/SecureInitialDataLoad";
import Home from "./Home";
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
  const devKeys = { "dev-ak": "AK", "dev-az": "AZ", "dev-ma": "MA" };
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
    <Router>
      <Security
        {...config.oidc}
        tokenManager={{ secure: true, storage: "cookie" }}
      >
        <SecureInitialDataLoad />
        <SecureRoute path="/" component={Home} />
        <Route path={config.callback} component={LoginCallback} />
        <SecureRoute path="/profile" component={Profile} />
      </Security>
    </Router>
  );
};

export default WrappedSecurity;
