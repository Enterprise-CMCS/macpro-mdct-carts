import React from "react";
import { Navigate, Routes, Route } from "react-router";
import { Print } from "./components/sections/Print";
import Spinner from "./components/utils/Spinner";
import UserProfile from "./components/sections/UserProfile";
import { useUser } from "./hooks/authHooks";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";
import GetHelp from "./components/sections/GetHelp";
import StateHome from "./components/layout/HomeState";
import Sidebar from "./components/layout/Sidebar";
import InvokeSection from "./components/utils/InvokeSection";
import CertifyAndSubmit from "./components/layout/CertifyAndSubmit";
import CMSHomepage from "./components/sections/homepage/CMSHomepage";
import FormTemplates from "./components/layout/FormTemplates";
import SaveError from "./components/layout/SaveError";
import ScrollToTop from "./components/utils/ScrollToTop";
import { NotFoundPage } from "./components/layout/NotFoundPage";
import { AppRoles } from "./types.js";
import { ROUTE_PATHS } from "./util/routePaths";

const CertifyPage = () => (
  <>
    <SaveError />
    <ScrollToTop />
    <div className="ds-l-container">
      <div className="ds-l-row">
        <Sidebar />
        <CertifyAndSubmit />
      </div>
    </div>
  </>
);

const Section = () => {
  return (
    <>
      <SaveError />
      <ScrollToTop />
      <div className="ds-l-container">
        <div className="ds-l-row">
          <Sidebar />
          <InvokeSection />
        </div>
      </div>
    </>
  );
};

const AppRoutes = () => {
  const { user } = useUser();

  const isCMSUser =
    user?.userRole === AppRoles.CMS_USER ||
    user?.userRole === AppRoles.INTERNAL_USER ||
    user?.userRole === AppRoles.HELP_DESK ||
    user?.userRole === AppRoles.CMS_APPROVER;

  const isStateUser = user?.userRole === AppRoles.STATE_USER;

  const isAdminUser = user?.userRole === AppRoles.CMS_ADMIN;

  return (
    <>
      <Spinner />
      <Routes>
        {/* General Routes */}
        <Route
          path={ROUTE_PATHS.home}
          element={
            isStateUser ? (
              <StateHome />
            ) : /* oxlint-disable-next-line no-nested-ternary */
            isCMSUser | isAdminUser ? (
              <CMSHomepage />
            ) : (
              <Navigate to={ROUTE_PATHS.userProfile} />
            )
          }
        />
        <Route path={ROUTE_PATHS.userProfile} element={<UserProfile />} />
        <Route path={ROUTE_PATHS.print} element={<Print />} />
        <Route path={ROUTE_PATHS.getHelp} element={<GetHelp />} />
        {/* State user form URLs */}
        <Route path={ROUTE_PATHS.sectionSubsection} element={<Section />} />
        <Route path={ROUTE_PATHS.section} element={<Section />} />
        <Route path={ROUTE_PATHS.certifyAndSubmit} element={<CertifyPage />} />
        {/* Admin & CMS user form URLs */}
        <Route
          path={ROUTE_PATHS.viewsSectionSubsection}
          element={<Section />}
        />
        <Route path={ROUTE_PATHS.viewsSection} element={<Section />} />
        <Route path={ROUTE_PATHS.stateReports} element={<CMSHomepage />} />
        <Route path={ROUTE_PATHS.templates} element={<FormTemplates />} />
        {/* If path not found */}
        <Route path={ROUTE_PATHS.notFound} element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
