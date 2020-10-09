import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/sections/homepage/Homepage";
import UserProfile from "./components/sections/UserProfile";
import Review from "./components/review/Review";
import Sidebar from "./components/layout/Sidebar";
import Userinfo from "./components/sections/Userinfo";
import test from "./components/test";
import InvokeSection from "./components/Utils/InvokeSection";
import ScrollToTop from "./components/Utils/ScrollToTop";
import CertifyAndSubmit from "./components/layout/CertifyAndSubmit";
import SaveError from "./components/layout/SaveError";

const VisibleSidebar =
  window.location.pathname === "/" ||
  window.location.pathname.split("/")[1] === "reports" ||
  window.location.pathname.split("/")[1] === "coming-soon" ? null : (
    <Sidebar />
  );

const Routes = ({ userData }) => (
  <Router>
    <div className="ds-l-container">
      <div className="ds-l-row">
        {VisibleSidebar}
        <SaveError />
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/user/profile" component={UserProfile} />
          <Route path="/reports/:stateAbbrev/:year" component={Review} />
          <Route path="/sections/:year/:sectionOrdinal/:subsectionMarker">
            <InvokeSection userData={userData} />
          </Route>
          <Route path="/sections/:year/:sectionOrdinal">
            <InvokeSection userData={userData} />
          </Route>
          <Route path="/sections/certify-and-submit">
            <CertifyAndSubmit />
          </Route>
          <Route exact path="/test" component={test} />
          <Route exact path="/userinfo" component={Userinfo} />
        </Switch>
      </div>
    </div>
  </Router>
);

Routes.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default Routes;
