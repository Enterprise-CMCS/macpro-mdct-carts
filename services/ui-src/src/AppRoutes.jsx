import React from "react";
import { Navigate, Routes, Route } from "react-router";
import { Print } from "./components/sections/Print";
import Spinner from "./components/utils/Spinner";
import UserProfile from "./components/sections/UserProfile";
import { useUser } from "./hooks/authHooks";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";
import GetHelp from "./components/sections/GetHelp";
import AdminHome from "./components/layout/HomeAdmin";
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
          path="/"
          element={
            isStateUser ? (
              <StateHome />
            ) : isAdminUser ? (
              <AdminHome />
            ) : isCMSUser ? (
              <CMSHomepage />
            ) : (
              <Navigate to="/user/profile" />
            )
          }
        />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/print" element={<Print />} />
        <Route path="/get-help" element={<GetHelp />} />
        // State User Form URLS
        <Route
          path="/sections/:year/:sectionOrdinal/:subsectionMarker"
          element={<Section />}
        />
        <Route path="sections/:year/:sectionOrdinal" element={<Section />} />
        <Route
          path="/sections/:year/certify-and-submit"
          element={<CertifyPage />}
        />
        //Admin & CMS User Form URLS
        <Route
          path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
          element={<Section />}
        />
        <Route
          path="/views/sections/:state/:year/:sectionOrdinal"
          element={<Section />}
        />
        <Route path="/state-reports" element={<CMSHomepage />} />
        <Route path="/templates" element={<FormTemplates />} />
        //If path not found
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
