import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { constructIdFromYearSectionAndSubsection } from "./store/formData";
import Homepage from "./components/sections/homepage/Homepage";
import Section2BApi from "./components/sections/section2api/Section2BApi";
import Review from "./components/review/Review";
import Sidebar from "./components/layout/Sidebar";
import Section from "./components/layout/Section";
import test from "./components/test";
import ScrollToTop from "./components/Utils/ScrollToTop";
import SaveError from "./components/layout/SaveError";

let VisibleSidebar =
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
          <Route path="/sections/:year/02/b" component={Section2BApi} />
          <Route
            path="/sections/:year/:sectionOrdinal/:subsectionMarker"
            children={<InvokeSection userData={userData} />}
          />
          <Route
            path="/sections/:year/:sectionOrdinal"
            children={<InvokeSection userData={userData} />}
          />
          <Route exact path="/test" component={test} />
        </Switch>
      </div>
    </div>
  </Router>
);

const InvokeSection = ({ userData }) => {
  let { year, sectionOrdinal, subsectionMarker } = useParams();
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

export default Routes;
