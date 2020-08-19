/* 
To Enable OKTA Authentication, you will need to:
1. Uncomment out the OKTA Enabled section below
2. Comment out the OKTA Disabled section below
3. Go to layout > Header.js and ensure the Logout feature is uncommented

To Disable OKTA Authentication, you will need to:
1. Uncomment out the OKTA Disabled section below
2. Comment out the OKTA Enabled section below
3. Got to layout > Header.js and ensure the Logout feature is commented out
*/
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
      {/* <Security {...config.oidc}>
        <SecureRoute path="/" component={Home} />
        <Route path={config.callback} component={LoginCallback} />
      </Security> */}

      {/* OKTA Disabled */}
      <Route component={Home} />

    </Router>
  );
}

export default App;
