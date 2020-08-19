import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import Routes from "./reactRouter";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  let VisibleHeader =
    window.location.pathname.split("/")[1] === "reports" ? null : <Header />;

  let VisibleFooter =
    window.location.pathname.split("/")[1] === "reports" ? null : <Footer />;
  return (
    <Router>
      {/* OKTA Enabled */}
      {/* To enable OKTA Authentication, you will also need to go into layout > Header.js
      and ensure the Logout feature around Line 59 is uncommented */}
      {/* <Security {...config.oidc}>
        <SecureRoute path="/" component={Home} />
        <Route path={config.callback} component={LoginCallback} />
      </Security> */}

      {/* OKTA Disabled */}
      {/* To disable OKTA Authentication, you will also need to go into layout > Header.js
      and ensure the Logout feature around Line 59 is commented out*/}
      <Route component={Home} />

    </Router>
  );
}

export default App;
