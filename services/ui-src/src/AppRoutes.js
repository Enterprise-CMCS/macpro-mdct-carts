import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/layout/Home";
import Footer from "./components/layout/Footer";
import Userinfo from "./components/sections/Userinfo";
import UserProfile from "./components/sections/UserProfile";
import Print from "./components/sections/Print";
import Profile from "./Profile";
import Spinner from "./components/Utils/Spinner";
import { LocalLogins } from "./components/sections/login/LocalLogins";
import { useUser } from "./hooks/authHooks";

const AppRoutes = () => {
  const { user, userRole, showLocalLogins, loginWithIDM } = useUser();

  if (!user && showLocalLogins) {
    return (<LocalLogins loginWithIDM={loginWithIDM}/>);
  }

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


  // TODO: add user role hooks
  return (
    <div
      className={"App " + window.location.pathname.split("/")[1]}
      data-test="component-app"
    >
      {VisibleHeader}
      <Spinner />
      <Router>
        <Home user={user} role={userRole} />
        {/* These routes are available to everyone, so define them here */}
        <Route exact path="/userinfo" component={Userinfo} />
        <Route path="/profile" component={Profile} />
        <Route path="/user/profile" component={UserProfile} />
        <Route path="/print" component={Print} />
      </Router>
      {VisibleFooter}
    </div>
  );
};

export default AppRoutes;
