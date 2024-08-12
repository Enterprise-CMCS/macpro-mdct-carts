import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/layout/Home";
import Footer from "./components/layout/Footer";
import Print from "./components/sections/Print";
import Spinner from "./components/utils/Spinner";
import UserInfo from "./components/sections/UserInfo";
import UserProfile from "./components/sections/UserProfile";
import { LocalLogins } from "./components/sections/login/LocalLogins";
import { useUser } from "./hooks/authHooks";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";
import GetHelp from "./components/sections/GetHelp";
import Timeout from "./components/layout/Timeout";

const AppRoutes = () => {
  const { user, showLocalLogins, loginWithIDM } = useUser();

  if (!user && showLocalLogins) {
    return <LocalLogins loginWithIDM={loginWithIDM} />;
  }

  const VisibleHeader = () =>
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? (
      <></>
    ) : (
      <Header currentUser={user} />
    );

  const VisibleFooter = () =>
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? (
      <></>
    ) : (
      <Footer />
    );

  return (
    <div
      className={"App " + window.location.pathname.split("/")[1]}
      data-test="component-app"
    >
      <div className="app-content">
        <Spinner />
        <VisibleHeader />
        <Home role={user?.userRole || ""} />
        <Timeout />
        <Routes>
          {/* These routes are available to everyone, so define them here */}
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/print" element={<Print />} />
          <Route path="/get-help" element={<GetHelp />} />
        </Routes>
      </div>
      {<VisibleFooter />}
    </div>
  );
};

export default AppRoutes;
