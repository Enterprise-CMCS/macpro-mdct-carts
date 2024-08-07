import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
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

  const VisibleHeader =
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? null : (
      <Header currentUser={user} />
    );

  const VisibleFooter =
    window.location.pathname.split("/")[1] === "reports" ||
    window.location.pathname.split("/")[1] === "coming-soon" ? null : (
      <Footer />
    );

  return (
    <div
      className={"App " + window.location.pathname.split("/")[1]}
      data-test="component-app"
    >
      <div className="app-content">
        <Spinner />
        <Router>
          {VisibleHeader}
          <Home role={user?.userRole || ""} />
          <Timeout />
          {/* These routes are available to everyone, so define them here */}
          <Route exact path="/userinfo" component={UserInfo} />
          <Route path="/user/profile" component={UserProfile} />
          <Route path="/print" component={Print} />
          <Route path="/get-help" component={GetHelp} />
        </Router>
      </div>
      {VisibleFooter}
    </div>
  );
};

export default AppRoutes;
