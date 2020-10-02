import React from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { constructIdFromYearSectionAndSubsection } from "./store/formData";
import Homepage from "./components/sections/homepage/Homepage";
import Review from "./components/review/Review";
import Sidebar from "./components/layout/Sidebar";
import Section from "./components/layout/Section";
import Userinfo from "./components/sections/Userinfo";
import test from "./components/test";
import ScrollToTop from "./components/Utils/ScrollToTop";
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
          <Route path="/reports/:stateAbbrev/:year" component={Review} />
          <Route path="/sections/:year/:sectionOrdinal/:subsectionMarker">
            <InvokeSection userData={userData} />
          </Route>
          <Route path="/sections/:year/:sectionOrdinal">
            <InvokeSection userData={userData} />
          </Route>
          <Route path="/sections/:year/:sectionOrdinal">
            <InvokeSection userData={userData} />
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

const InvokeSection = ({ userData }) => {
  const { year, sectionOrdinal, subsectionMarker } = useParams();
  const filteredMarker = subsectionMarker
    ? subsectionMarker.toLowerCase()
    : "a";
  const sectionId = constructIdFromYearSectionAndSubsection(
    Number(year),
    Number(sectionOrdinal)
  );
  const subsectionId = constructIdFromYearSectionAndSubsection(
    Number(year),
    Number(sectionOrdinal),
    filteredMarker
  );
  return (
    <Section
      userData={userData}
      sectionId={sectionId}
      subsectionId={subsectionId}
    />
  );
};

InvokeSection.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default Routes;
